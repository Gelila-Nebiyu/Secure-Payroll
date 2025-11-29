-- Part 4: DAC (Discretionary Access Control) Tables

-- DAC permissions for resource-level access control
CREATE TABLE IF NOT EXISTS dac_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  grantee_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission permission_action NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(owner_user_id, resource_type, resource_id, grantee_user_id, permission)
);

-- Enable RLS
ALTER TABLE dac_permissions ENABLE ROW LEVEL SECURITY;

-- Policies: owners can manage their grants, grantees can view their permissions
CREATE POLICY "dac_owner_all" ON dac_permissions
  FOR ALL USING (owner_user_id = auth.uid());

CREATE POLICY "dac_grantee_select" ON dac_permissions
  FOR SELECT USING (grantee_user_id = auth.uid());
