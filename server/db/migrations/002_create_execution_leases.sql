CREATE TABLE IF NOT EXISTS execution_leases (
  id SERIAL PRIMARY KEY,
  proposal_id VARCHAR(255) NOT NULL UNIQUE,
  acquired_by VARCHAR(255) NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  lease_duration_hours INTEGER NOT NULL DEFAULT 72,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'released', 'warning')),
  warning_threshold_pct INTEGER NOT NULL DEFAULT 80,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_execution_leases_proposal_id ON execution_leases(proposal_id);
CREATE INDEX idx_execution_leases_status ON execution_leases(status);
CREATE INDEX idx_execution_leases_expires_at ON execution_leases(expires_at);
