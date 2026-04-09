import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Pool } from 'pg';
import { ExecutionLeaseManager } from '../services/ExecutionLeaseManager';
import type { ExecutionLease } from '../db';

/**
 * Stress test: 100 concurrent acquireLease calls for the SAME proposal_id.
 * Simulates SELECT ... FOR UPDATE atomic acquisition semantics.
 * Exactly 1 should succeed; the rest must fail with a conflict error.
 */

vi.mock('../db', () => {
  let leaseHeld = false;

  const acquireLease = vi.fn(
    async (
      proposalId: string,
      acquiredBy: string,
      durationHours?: number
    ): Promise<ExecutionLease> => {
      // Simulate the atomic locking: only the first caller wins
      if (leaseHeld) {
        throw new Error(`Lease already held for proposal ${proposalId}`);
      }
      leaseHeld = true;
      const hours = durationHours ?? 72;
      const now = new Date();
      return {
        id: 1,
        proposalId,
        acquiredBy,
        acquiredAt: now,
        expiresAt: new Date(now.getTime() + hours * 3600_000),
        leaseDurationHours: hours,
        status: 'active',
        warningThresholdPct: 80,
        metadata: {},
        createdAt: now,
        updatedAt: now,
      };
    }
  );

  return {
    acquireLease,
    releaseLease: vi.fn(),
    getActiveLease: vi.fn(),
    getExpiredLeases: vi.fn().mockResolvedValue([]),
    getWarningLeases: vi.fn().mockResolvedValue([]),
    updateLeaseStatus: vi.fn(),
    listActiveLeases: vi.fn().mockResolvedValue([]),
  };
});

import * as dbModule from '../db';

const THREAD_COUNT = 100;
const PROPOSAL_ID = 'stress-test-proposal';
const mockPool = {} as Pool;

beforeEach(() => {
  vi.resetAllMocks();
  // Re-initialize leaseHeld state between tests by resetting mock implementation
  let leaseHeld = false;
  vi.mocked(dbModule.acquireLease).mockImplementation(
    async (proposalId: string, acquiredBy: string, durationHours?: number) => {
      if (leaseHeld) {
        throw new Error(`Lease already held for proposal ${proposalId}`);
      }
      leaseHeld = true;
      const hours = durationHours ?? 72;
      const now = new Date();
      return {
        id: 1,
        proposalId,
        acquiredBy,
        acquiredAt: now,
        expiresAt: new Date(now.getTime() + hours * 3600_000),
        leaseDurationHours: hours,
        status: 'active',
        warningThresholdPct: 80,
        metadata: {},
        createdAt: now,
        updatedAt: now,
      };
    }
  );
});

describe('Stress Test — 100-thread concurrent lease acquisition', () => {
  it('should allow exactly 1 acquisition and reject 99 with conflict', async () => {
    const manager = new ExecutionLeaseManager(mockPool);

    const tasks = Array.from({ length: THREAD_COUNT }, (_, i) =>
      manager.acquireLease(PROPOSAL_ID, `worker-${i}`)
    );

    const results = await Promise.allSettled(tasks);

    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(THREAD_COUNT - 1);
  });

  it('should have no duplicate leases after concurrent acquisition', async () => {
    const manager = new ExecutionLeaseManager(mockPool);

    const tasks = Array.from({ length: THREAD_COUNT }, (_, i) =>
      manager.acquireLease(PROPOSAL_ID, `worker-${i}`)
    );

    const results = await Promise.allSettled(tasks);
    const fulfilled = results
      .filter(
        (r): r is PromiseFulfilledResult<ExecutionLease> => r.status === 'fulfilled'
      )
      .map((r) => r.value);

    // No duplicates — each unique proposal_id should appear at most once
    const uniqueProposalIds = new Set(fulfilled.map((l) => l.proposalId));
    expect(uniqueProposalIds.size).toBe(fulfilled.length);
    expect(fulfilled.length).toBe(1);
  });

  it('should ensure failure reason is a conflict/lock error', async () => {
    const manager = new ExecutionLeaseManager(mockPool);

    const tasks = Array.from({ length: THREAD_COUNT }, (_, i) =>
      manager.acquireLease(PROPOSAL_ID, `worker-${i}`)
    );

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter(
      (r): r is PromiseRejectedResult => r.status === 'rejected'
    );

    for (const r of rejected) {
      expect((r.reason as Error).message).toMatch(/Lease already held/i);
    }
  });
});
