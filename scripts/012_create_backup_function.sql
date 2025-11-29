-- Create backup tracking table
CREATE TABLE IF NOT EXISTS backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  file_path TEXT,
  file_size_bytes BIGINT,
  tables_backed_up TEXT[],
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Function to log backup start
CREATE OR REPLACE FUNCTION log_backup_start(p_backup_type VARCHAR)
RETURNS UUID AS $$
DECLARE
  v_backup_id UUID;
BEGIN
  INSERT INTO backup_history (backup_type, status, tables_backed_up)
  VALUES (
    p_backup_type, 
    'started',
    ARRAY(
      SELECT table_name::TEXT 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    )
  )
  RETURNING id INTO v_backup_id;
  
  RETURN v_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log backup completion
CREATE OR REPLACE FUNCTION log_backup_complete(
  p_backup_id UUID,
  p_file_path TEXT,
  p_file_size BIGINT
)
RETURNS VOID AS $$
BEGIN
  UPDATE backup_history
  SET 
    status = 'completed',
    file_path = p_file_path,
    file_size_bytes = p_file_size,
    completed_at = NOW()
  WHERE id = p_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log backup failure
CREATE OR REPLACE FUNCTION log_backup_failed(
  p_backup_id UUID,
  p_error_message TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE backup_history
  SET 
    status = 'failed',
    error_message = p_error_message,
    completed_at = NOW()
  WHERE id = p_backup_id;
END;
$$ LANGUAGE plpgsql;

-- Index for backup history queries
CREATE INDEX IF NOT EXISTS idx_backup_history_status ON backup_history(status);
CREATE INDEX IF NOT EXISTS idx_backup_history_created ON backup_history(started_at DESC);
