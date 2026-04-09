import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory } from '../_core/trpc';
import { syncRouter } from '../routers/syncRouter';
import type { SyncHistoryRecord } from '../db';

// Mock the database module
vi.mock('../db', () => ({
  recordSyncHistory: vi.fn(),
  getSyncHistoryByCapsule: vi.fn(),
}));

import * as dbModule from '../db';

const createCaller = createCallerFactory(syncRouter);
const caller = createCaller({} as never);

function makeRecord(overrides: Partial<SyncHistoryRecord> = {}): SyncHistoryRecord {
  return {
    id: 1,
    capsuleId: 42,
    sourcePlatform: 'Alpha',
    targetPlatform: 'Beta',
    plvMetric: null,
    status: 'completed',
    errorMessage: null,
    timestamp: new Date('2024-01-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('syncRouter — recordHistory', () => {
  it('should record sync history successfully', async () => {
    const record = makeRecord({ status: 'completed' });
    vi.mocked(dbModule.recordSyncHistory).mockResolvedValue(record);

    const result = await caller.recordHistory({
      capsuleId: 42,
      sourcePlatform: 'Alpha',
      targetPlatform: 'Beta',
      status: 'completed',
    });

    expect(result.success).toBe(true);
    expect(result.record.status).toBe('completed');
    expect(dbModule.recordSyncHistory).toHaveBeenCalledOnce();
  });

  it('should reject invalid status values', async () => {
    await expect(
      caller.recordHistory({
        capsuleId: 42,
        sourcePlatform: 'Alpha',
        targetPlatform: 'Beta',
        // @ts-expect-error intentional invalid value
        status: 'invalid_status',
      })
    ).rejects.toThrow();
  });
});

describe('syncRouter — getHistory', () => {
  it('should retrieve history for a capsule', async () => {
    const records = [
      makeRecord({ id: 1, status: 'completed' }),
      makeRecord({ id: 2, status: 'failed' }),
    ];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getHistory({ capsuleId: 42 });

    expect(result.total).toBe(2);
    expect(result.history).toHaveLength(2);
    expect(result.history[0].status).toBe('completed');
  });

  it('should return empty history for non-existent capsule', async () => {
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue([]);

    const result = await caller.getHistory({ capsuleId: 9999 });

    expect(result.total).toBe(0);
    expect(result.history).toHaveLength(0);
  });
});

describe('syncRouter — getMetrics', () => {
  it('should calculate metrics correctly with mixed statuses', async () => {
    const records = [
      makeRecord({ status: 'completed', plvMetric: '0.85' }),
      makeRecord({ status: 'completed', plvMetric: '0.90' }),
      makeRecord({ status: 'failed', plvMetric: null }),
    ];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getMetrics({ capsuleId: 42 });

    expect(result.totalSyncs).toBe(3);
    expect(result.successfulSyncs).toBe(2);
    expect(result.failedSyncs).toBe(1);
    expect(result.successRate).toBeCloseTo(2 / 3);
  });

  it('should calculate PLV average correctly', async () => {
    const records = [
      makeRecord({ plvMetric: '0.80' }),
      makeRecord({ plvMetric: '0.60' }),
    ];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getMetrics({ capsuleId: 42 });

    expect(result.averagePLV).toBeCloseTo(0.70);
  });

  it('should return OPTIMAL entrainment status for PLV > 0.9', async () => {
    const records = [makeRecord({ plvMetric: '0.95' })];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getMetrics({ capsuleId: 42 });

    expect(result.entrainmentStatus).toBe('OPTIMAL');
  });

  it('should return GOOD entrainment status for PLV 0.7-0.9', async () => {
    const records = [makeRecord({ plvMetric: '0.80' })];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getMetrics({ capsuleId: 42 });

    expect(result.entrainmentStatus).toBe('GOOD');
  });

  it('should return DEGRADED entrainment status for PLV < 0.7', async () => {
    const records = [makeRecord({ plvMetric: '0.50' })];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getMetrics({ capsuleId: 42 });

    expect(result.entrainmentStatus).toBe('DEGRADED');
  });
});

describe('syncRouter — getAuditTrail', () => {
  it('should return audit trail sorted by timestamp descending', async () => {
    const records = [
      makeRecord({ id: 1, timestamp: new Date('2024-01-01T01:00:00Z'), status: 'initiated' }),
      makeRecord({ id: 2, timestamp: new Date('2024-01-01T03:00:00Z'), status: 'completed' }),
      makeRecord({ id: 3, timestamp: new Date('2024-01-01T02:00:00Z'), status: 'syncing' }),
    ];
    vi.mocked(dbModule.getSyncHistoryByCapsule).mockResolvedValue(records);

    const result = await caller.getAuditTrail({ capsuleId: 42 });

    expect(result.total).toBe(3);
    // Should be sorted descending by timestamp
    expect(result.entries[0].id).toBe(2); // 03:00 first
    expect(result.entries[1].id).toBe(3); // 02:00 second
    expect(result.entries[2].id).toBe(1); // 01:00 last
    // Sequence numbers should start at 1
    expect(result.entries[0].sequence).toBe(1);
  });
});
