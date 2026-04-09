import { EventEmitter } from 'events';
import type { Pool } from 'pg';
import * as db from '../db';

export interface LeaseConfig {
  defaultDurationHours: number;
  warningThresholdPct: number;
  watchdogIntervalMs: number;
}

export interface LeaseStatus {
  proposalId: string;
  status: 'active' | 'expired' | 'released' | 'warning' | 'not_found';
  acquiredBy?: string;
  acquiredAt?: Date;
  expiresAt?: Date;
  timeRemainingMs?: number;
  percentElapsed?: number;
}

const DEFAULT_CONFIG: LeaseConfig = {
  defaultDurationHours: 72,
  warningThresholdPct: 80,
  watchdogIntervalMs: 5 * 60 * 1000, // 5 minutes
};

export class ExecutionLeaseManager extends EventEmitter {
  private readonly pool: Pool;
  private readonly config: LeaseConfig;
  private watchdogTimer: ReturnType<typeof setInterval> | null = null;

  constructor(pool: Pool, config: Partial<LeaseConfig> = {}) {
    super();
    this.pool = pool;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async acquireLease(
    proposalId: string,
    acquiredBy: string,
    durationHours?: number
  ): Promise<db.ExecutionLease> {
    const hours = durationHours ?? this.config.defaultDurationHours;
    return db.acquireLease(proposalId, acquiredBy, hours, this.pool);
  }

  async releaseLease(proposalId: string): Promise<void> {
    return db.releaseLease(proposalId, this.pool);
  }

  async checkLease(proposalId: string): Promise<LeaseStatus> {
    return this.getLeaseStatus(proposalId);
  }

  async getLeaseStatus(proposalId: string): Promise<LeaseStatus> {
    const lease = await db.getActiveLease(proposalId, this.pool);
    if (!lease) {
      return { proposalId, status: 'not_found' };
    }

    const now = Date.now();
    const acquiredAtMs = lease.acquiredAt.getTime();
    const expiresAtMs = lease.expiresAt.getTime();
    const totalDurationMs = expiresAtMs - acquiredAtMs;
    const elapsedMs = now - acquiredAtMs;
    const timeRemainingMs = Math.max(0, expiresAtMs - now);
    const percentElapsed =
      totalDurationMs > 0 ? (elapsedMs / totalDurationMs) * 100 : 100;

    return {
      proposalId,
      status: lease.status,
      acquiredBy: lease.acquiredBy,
      acquiredAt: lease.acquiredAt,
      expiresAt: lease.expiresAt,
      timeRemainingMs,
      percentElapsed,
    };
  }

  startWatchdog(): void {
    if (this.watchdogTimer !== null) return;
    this.watchdogTimer = setInterval(
      () => void this._runWatchdog(),
      this.config.watchdogIntervalMs
    );
  }

  stopWatchdog(): void {
    if (this.watchdogTimer !== null) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  private async _runWatchdog(): Promise<void> {
    try {
      // Mark expired leases
      const expired = await db.getExpiredLeases(this.pool);
      for (const lease of expired) {
        await db.updateLeaseStatus(lease.proposalId, 'expired', this.pool);
        console.log(`[ExecutionLeaseManager] Lease expired: ${lease.proposalId}`);
        this.emit('leaseExpired', lease);
      }

      // Mark warning leases
      const warning = await db.getWarningLeases(this.pool);
      for (const lease of warning) {
        if (lease.status !== 'warning') {
          await db.updateLeaseStatus(lease.proposalId, 'warning', this.pool);
          console.log(`[ExecutionLeaseManager] Lease warning: ${lease.proposalId}`);
          this.emit('leaseWarning', lease);
        }
      }

      console.log(
        `[ExecutionLeaseManager] Watchdog ran — expired: ${expired.length}, warnings: ${warning.length}`
      );
    } catch (err) {
      console.error('[ExecutionLeaseManager] Watchdog error:', err);
    }
  }
}
