-- Part 7: Audit Logs and Sessions

-- Audit logs table (encrypted metadata at application level)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  result TEXT, -- 'success', 'denied', 'error'
  metadata_encrypted TEXT, -- AES-GCM encrypted JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System events log
CREATE TABLE IF NOT EXISTS system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_info JSONB,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role assignment audit trail
CREATE TABLE IF NOT EXISTS role_assignment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  action TEXT NOT NULL, -- 'assigned', 'revoked', 'modified'
  performed_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignment_logs ENABLE ROW LEVEL SECURITY;

-- Audit log policies (admin only)
CREATE POLICY "audit_admin_select" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator')
    )
  );

-- Allow inserting audit logs for authenticated users
CREATE POLICY "audit_insert_authenticated" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- System events (admin only)
CREATE POLICY "system_events_admin_select" ON system_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator')
    )
  );

-- Sessions policies
CREATE POLICY "sessions_select_own" ON sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "sessions_delete_own" ON sessions
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "sessions_insert_own" ON sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Role assignment logs (admin view)
CREATE POLICY "role_logs_admin_select" ON role_assignment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator', 'HR Manager')
    )
  );
