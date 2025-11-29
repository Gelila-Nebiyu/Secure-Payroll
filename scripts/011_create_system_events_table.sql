-- Create system events table for centralized logging
CREATE TABLE IF NOT EXISTS system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  description TEXT,
  encrypted_metadata TEXT,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_system_events_type ON system_events(event_type);
CREATE INDEX IF NOT EXISTS idx_system_events_severity ON system_events(severity);
CREATE INDEX IF NOT EXISTS idx_system_events_created ON system_events(created_at DESC);

-- Create a view for recent critical events (for alerting)
CREATE OR REPLACE VIEW recent_critical_events AS
SELECT * FROM system_events
WHERE severity = 'critical'
AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
