import type { Pool } from 'pg';
import { pool as defaultPool } from './pool';

export interface SyncHistoryRecord {
  id: number;
  capsuleId: number;
  sourcePlatform: string;
  targetPlatform: string;
  plvMetric: string | null;
  status: 'initiated' | 'syncing' | 'completed' | 'failed';
  errorMessage: string | null;
  timestamp: Date;
  createdAt: Date;
}

export interface ExecutionLease {
  id: number;
  proposalId: string;
  acquiredBy: string;
  acquiredAt: Date;
  expiresAt: Date;
  leaseDurationHours: number;
  status: 'active' | 'expired' | 'released' | 'warning';
  warningThresholdPct: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

function mapLease(row: Record<string, unknown>): ExecutionLease {
  return {
    id: row.id as number,
    proposalId: row.proposal_id as string,
    acquiredBy: row.acquired_by as string,
    acquiredAt: row.acquired_at as Date,
    expiresAt: row.expires_at as Date,
    leaseDurationHours: row.lease_duration_hours as number,
    status: row.status as ExecutionLease['status'],
    warningThresholdPct: row.warning_threshold_pct as number,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

function mapSyncHistory(row: Record<string, unknown>): SyncHistoryRecord {
  return {
    id: row.id as number,
    capsuleId: row.capsule_id as number,
    sourcePlatform: row.source_platform as string,
    targetPlatform: row.target_platform as string,
    plvMetric: row.plv_metric as string | null,
    status: row.status as SyncHistoryRecord['status'],
    errorMessage: row.error_message as string | null,
    timestamp: row.timestamp as Date,
    createdAt: row.created_at as Date,
  };
}

// ---------------------------------------------------------------------------
// Sync History
// ---------------------------------------------------------------------------

export async function recordSyncHistory(
  params: {
    capsuleId: number;
    sourcePlatform: string;
    targetPlatform: string;
    plvMetric?: string | null;
    status: SyncHistoryRecord['status'];
    errorMessage?: string | null;
  },
  db: Pool = defaultPool
): Promise<SyncHistoryRecord> {
  const { rows } = await db.query(
    `INSERT INTO sync_history
       (capsule_id, source_platform, target_platform, plv_metric, status, error_message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      params.capsuleId,
      params.sourcePlatform,
      params.targetPlatform,
      params.plvMetric ?? null,
      params.status,
      params.errorMessage ?? null,
    ]
  );
  return mapSyncHistory(rows[0]);
}

export async function getSyncHistoryByCapsule(
  capsuleId: number,
  db: Pool = defaultPool
): Promise<SyncHistoryRecord[]> {
  const { rows } = await db.query(
    `SELECT * FROM sync_history WHERE capsule_id = $1 ORDER BY timestamp DESC`,
    [capsuleId]
  );
  return rows.map(mapSyncHistory);
}

// ---------------------------------------------------------------------------
// Execution Leases
// ---------------------------------------------------------------------------

export async function acquireLease(
  proposalId: string,
  acquiredBy: string,
  durationHours = 72,
  db: Pool = defaultPool
): Promise<ExecutionLease> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Lock the row if it exists so concurrent callers wait
    const existing = await client.query(
      `SELECT * FROM execution_leases WHERE proposal_id = $1 FOR UPDATE`,
      [proposalId]
    );

    if (existing.rows.length > 0) {
      const lease = mapLease(existing.rows[0]);
      if (lease.status === 'active' || lease.status === 'warning') {
        await client.query('ROLLBACK');
        throw new Error(`Lease already held for proposal ${proposalId}`);
      }
      // Re-acquire a previously released/expired lease
      const { rows } = await client.query(
        `UPDATE execution_leases
         SET acquired_by = $1,
             acquired_at = NOW(),
             expires_at  = NOW() + ($2 || ' hours')::interval,
             lease_duration_hours = $2,
             status = 'active',
             updated_at = NOW()
         WHERE proposal_id = $3
         RETURNING *`,
        [acquiredBy, durationHours, proposalId]
      );
      await client.query('COMMIT');
      return mapLease(rows[0]);
    }

    const { rows } = await client.query(
      `INSERT INTO execution_leases
         (proposal_id, acquired_by, expires_at, lease_duration_hours, status)
       VALUES ($1, $2, NOW() + ($3 || ' hours')::interval, $3, 'active')
       RETURNING *`,
      [proposalId, acquiredBy, durationHours]
    );
    await client.query('COMMIT');
    return mapLease(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function releaseLease(
  proposalId: string,
  db: Pool = defaultPool
): Promise<void> {
  await db.query(
    `UPDATE execution_leases
     SET status = 'released', updated_at = NOW()
     WHERE proposal_id = $1 AND status IN ('active', 'warning')`,
    [proposalId]
  );
}

export async function getActiveLease(
  proposalId: string,
  db: Pool = defaultPool
): Promise<ExecutionLease | null> {
  const { rows } = await db.query(
    `SELECT * FROM execution_leases WHERE proposal_id = $1`,
    [proposalId]
  );
  return rows.length > 0 ? mapLease(rows[0]) : null;
}

export async function getExpiredLeases(
  db: Pool = defaultPool
): Promise<ExecutionLease[]> {
  const { rows } = await db.query(
    `SELECT * FROM execution_leases
     WHERE status = 'active' AND expires_at < NOW()`
  );
  return rows.map(mapLease);
}

export async function getWarningLeases(
  db: Pool = defaultPool
): Promise<ExecutionLease[]> {
  const { rows } = await db.query(
    `SELECT * FROM execution_leases
     WHERE status = 'active'
       AND EXTRACT(EPOCH FROM (NOW() - acquired_at)) /
           EXTRACT(EPOCH FROM (expires_at - acquired_at)) * 100
           >= warning_threshold_pct`
  );
  return rows.map(mapLease);
}

export async function updateLeaseStatus(
  proposalId: string,
  status: ExecutionLease['status'],
  db: Pool = defaultPool
): Promise<void> {
  await db.query(
    `UPDATE execution_leases
     SET status = $1, updated_at = NOW()
     WHERE proposal_id = $2`,
    [status, proposalId]
  );
}

export async function listActiveLeases(
  db: Pool = defaultPool
): Promise<ExecutionLease[]> {
  const { rows } = await db.query(
    `SELECT * FROM execution_leases WHERE status IN ('active', 'warning') ORDER BY acquired_at DESC`
  );
  return rows.map(mapLease);
}
