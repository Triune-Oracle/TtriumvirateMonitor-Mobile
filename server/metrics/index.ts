import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();
register.setDefaultLabels({ app: 'triumvirate_monitor' });

export const syncEventsTotal = new Counter({
  name: 'sync_events_total',
  help: 'Total number of sync events',
  labelNames: ['status', 'source_platform', 'target_platform'],
  registers: [register],
});

export const syncDurationSeconds = new Histogram({
  name: 'sync_duration_seconds',
  help: 'Duration of sync operations in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  registers: [register],
});

export const plvMetricValue = new Gauge({
  name: 'plv_metric_value',
  help: 'Latest PLV metric value per capsule',
  labelNames: ['capsule_id'],
  registers: [register],
});

export const activeLeasesTotal = new Gauge({
  name: 'active_leases_total',
  help: 'Number of currently active execution leases',
  registers: [register],
});

export const leaseAcquisitionsTotal = new Counter({
  name: 'lease_acquisitions_total',
  help: 'Total lease acquisition attempts',
  labelNames: ['result'],
  registers: [register],
});

export const leaseExpirationsTotal = new Counter({
  name: 'lease_expirations_total',
  help: 'Total number of expired leases',
  registers: [register],
});

export const leaseWarningsTotal = new Counter({
  name: 'lease_warnings_total',
  help: 'Total number of lease warning threshold breaches',
  registers: [register],
});

export const leaseTimeRemainingSeconds = new Gauge({
  name: 'lease_time_remaining_seconds',
  help: 'Time remaining on active leases in seconds',
  labelNames: ['proposal_id'],
  registers: [register],
});

export const watchdogRunsTotal = new Counter({
  name: 'watchdog_runs_total',
  help: 'Total number of watchdog execution runs',
  registers: [register],
});

export const dbQueryDurationSeconds = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers: [register],
});
