CREATE TABLE IF NOT EXISTS sync_history (
  id SERIAL PRIMARY KEY,
  capsule_id INTEGER NOT NULL,
  source_platform VARCHAR(255) NOT NULL,
  target_platform VARCHAR(255) NOT NULL,
  plv_metric VARCHAR(50),
  status VARCHAR(20) NOT NULL CHECK (status IN ('initiated', 'syncing', 'completed', 'failed')),
  error_message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_history_capsule_id ON sync_history(capsule_id);
CREATE INDEX idx_sync_history_status ON sync_history(status);
CREATE INDEX idx_sync_history_timestamp ON sync_history(timestamp DESC);
