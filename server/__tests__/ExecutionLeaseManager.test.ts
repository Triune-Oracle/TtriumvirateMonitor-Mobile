import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Pool } from 'pg';
import { ExecutionLeaseManager } from '../services/ExecutionLeaseManager';
import type { ExecutionLease } from '../db';

// Mock the db module
vi.mock('../db', () => ({
  acquireLease: vi.fn(),
  releaseLease: vi.fn(),
  getActiveLease: vi.fn(),
  getExpiredLeases: vi.fn(),
  getWarningLeases: vi.fn(),
  updateLeaseStatus: vi.fn(),
  listActiveLeases: vi.fn(),
}));

import * as dbModule from '../db';

const mockPool = {} as Pool;

function makeLease(overrides: Partial<ExecutionLease> = {}): ExecutionLease {
  const acquiredAt = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
  const expiresAt = new Date(Date.now() + 71 * 60 * 60 * 1000); // 71 hours from now
  return {
    id: 1,
    proposalId: 'proposal-1',
    acquiredBy: 'system',
    acquiredAt,
    expiresAt,
    leaseDurationHours: 72,
    status: 'active',
    warningThresholdPct: 80,
    metadata: {},
    createdAt: acquiredAt,
    updatedAt: acquiredAt,
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('ExecutionLeaseManager — acquireLease', () => {
  it('should acquire a new lease successfully', async () => {
    const lease = makeLease();
    vi.mocked(dbModule.acquireLease).mockResolvedValue(lease);

    const manager = new ExecutionLeaseManager(mockPool);
    const result = await manager.acquireLease('proposal-1', 'system');

    expect(result).toEqual(lease);
    expect(dbModule.acquireLease).toHaveBeenCalledWith(
      'proposal-1',
      'system',
      72,
      mockPool
    );
  });

  it('should reject acquisition when lease already active', async () => {
    vi.mocked(dbModule.acquireLease).mockRejectedValue(
      new Error('Lease already held for proposal proposal-1')
    );

    const manager = new ExecutionLeaseManager(mockPool);
    await expect(
      manager.acquireLease('proposal-1', 'other-system')
    ).rejects.toThrow('Lease already held');
  });
});

describe('ExecutionLeaseManager — releaseLease', () => {
  it('should release an active lease', async () => {
    vi.mocked(dbModule.releaseLease).mockResolvedValue(undefined);

    const manager = new ExecutionLeaseManager(mockPool);
    await manager.releaseLease('proposal-1');

    expect(dbModule.releaseLease).toHaveBeenCalledWith('proposal-1', mockPool);
  });
});

describe('ExecutionLeaseManager — getLeaseStatus', () => {
  it('should detect lease at warning threshold (80% elapsed)', async () => {
    const totalMs = 72 * 60 * 60 * 1000;
    const acquiredAt = new Date(Date.now() - totalMs * 0.85); // 85% elapsed
    const expiresAt = new Date(acquiredAt.getTime() + totalMs);
    const lease = makeLease({ acquiredAt, expiresAt, status: 'warning' });
    vi.mocked(dbModule.getActiveLease).mockResolvedValue(lease);

    const manager = new ExecutionLeaseManager(mockPool);
    const status = await manager.getLeaseStatus('proposal-1');

    expect(status.status).toBe('warning');
    expect(status.percentElapsed).toBeGreaterThan(80);
  });

  it('should detect lease expiration (100% elapsed)', async () => {
    const totalMs = 72 * 60 * 60 * 1000;
    const acquiredAt = new Date(Date.now() - totalMs * 1.1); // 110% elapsed
    const expiresAt = new Date(acquiredAt.getTime() + totalMs);
    const lease = makeLease({ acquiredAt, expiresAt, status: 'expired' });
    vi.mocked(dbModule.getActiveLease).mockResolvedValue(lease);

    const manager = new ExecutionLeaseManager(mockPool);
    const status = await manager.getLeaseStatus('proposal-1');

    expect(status.status).toBe('expired');
    expect(status.timeRemainingMs).toBe(0);
    expect(status.percentElapsed).toBeGreaterThan(100);
  });

  it('should calculate time remaining correctly', async () => {
    const acquiredAt = new Date(Date.now() - 60 * 60 * 1000);
    const expiresAt = new Date(Date.now() + 71 * 60 * 60 * 1000);
    const lease = makeLease({ acquiredAt, expiresAt });
    vi.mocked(dbModule.getActiveLease).mockResolvedValue(lease);

    const manager = new ExecutionLeaseManager(mockPool);
    const status = await manager.getLeaseStatus('proposal-1');

    expect(status.timeRemainingMs).toBeGreaterThan(0);
    expect(status.timeRemainingMs).toBeLessThanOrEqual(71 * 60 * 60 * 1000 + 100);
  });

  it('should calculate percentage elapsed correctly', async () => {
    const totalMs = 72 * 60 * 60 * 1000;
    const acquiredAt = new Date(Date.now() - totalMs * 0.5); // 50% elapsed
    const expiresAt = new Date(acquiredAt.getTime() + totalMs);
    const lease = makeLease({ acquiredAt, expiresAt });
    vi.mocked(dbModule.getActiveLease).mockResolvedValue(lease);

    const manager = new ExecutionLeaseManager(mockPool);
    const status = await manager.getLeaseStatus('proposal-1');

    expect(status.percentElapsed).toBeGreaterThan(48);
    expect(status.percentElapsed).toBeLessThan(52);
  });
});

describe('ExecutionLeaseManager — watchdog', () => {
  it('should run watchdog and detect expired leases', async () => {
    const expiredLease = makeLease({ status: 'active' });
    vi.mocked(dbModule.getExpiredLeases).mockResolvedValue([expiredLease]);
    vi.mocked(dbModule.getWarningLeases).mockResolvedValue([]);
    vi.mocked(dbModule.updateLeaseStatus).mockResolvedValue(undefined);

    const manager = new ExecutionLeaseManager(mockPool, { watchdogIntervalMs: 50 });
    // Call internal method directly
    await (manager as unknown as { _runWatchdog(): Promise<void> })._runWatchdog();

    expect(dbModule.updateLeaseStatus).toHaveBeenCalledWith(
      expiredLease.proposalId,
      'expired',
      mockPool
    );
  });

  it('should run watchdog and detect warning-threshold leases', async () => {
    const warningLease = makeLease({ status: 'active' });
    vi.mocked(dbModule.getExpiredLeases).mockResolvedValue([]);
    vi.mocked(dbModule.getWarningLeases).mockResolvedValue([warningLease]);
    vi.mocked(dbModule.updateLeaseStatus).mockResolvedValue(undefined);

    const manager = new ExecutionLeaseManager(mockPool, { watchdogIntervalMs: 50 });
    await (manager as unknown as { _runWatchdog(): Promise<void> })._runWatchdog();

    expect(dbModule.updateLeaseStatus).toHaveBeenCalledWith(
      warningLease.proposalId,
      'warning',
      mockPool
    );
  });
});
