-- Part 3: Roles and Permissions (RBAC)

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  resource TEXT NOT NULL,
  action permission_action NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource, action)
);

-- Role-Permission mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- User-Role mapping
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for roles (viewable by authenticated users)
CREATE POLICY "roles_select_authenticated" ON roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "roles_admin_all" ON roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'System Administrator'
    )
  );

-- Policies for permissions
CREATE POLICY "permissions_select_authenticated" ON permissions
  FOR SELECT TO authenticated USING (true);

-- Policies for role_permissions
CREATE POLICY "role_permissions_select_authenticated" ON role_permissions
  FOR SELECT TO authenticated USING (true);

-- Policies for user_roles
CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_roles_admin_all" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('System Administrator', 'HR Manager')
    )
  );

-- Insert default roles
INSERT INTO roles (name, description, is_system_role) VALUES
  ('System Administrator', 'Full system access, can manage all settings and users', TRUE),
  ('HR Manager', 'Can manage employees, view all HR data, approve requests', TRUE),
  ('Finance Manager', 'Can view and manage financial data and payroll', TRUE),
  ('Payroll Officer', 'Can process payroll for assigned departments', TRUE),
  ('Department Head', 'Can manage their department employees', FALSE),
  ('Employee', 'Regular employee with basic access', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
  -- User management
  ('user_create', 'users', 'create', 'Create new users'),
  ('user_read', 'users', 'read', 'View user information'),
  ('user_update', 'users', 'update', 'Update user information'),
  ('user_delete', 'users', 'delete', 'Delete users'),
  
  -- Payroll management
  ('payroll_create', 'payroll', 'create', 'Create payroll records'),
  ('payroll_read', 'payroll', 'read', 'View payroll records'),
  ('payroll_update', 'payroll', 'update', 'Update payroll records'),
  ('payroll_delete', 'payroll', 'delete', 'Delete payroll records'),
  ('payroll_approve', 'payroll', 'approve', 'Approve payroll submissions'),
  
  -- Role management
  ('role_create', 'roles', 'create', 'Create roles'),
  ('role_read', 'roles', 'read', 'View roles'),
  ('role_update', 'roles', 'update', 'Update roles'),
  ('role_delete', 'roles', 'delete', 'Delete roles'),
  
  -- Audit logs
  ('audit_read', 'audit_logs', 'read', 'View audit logs'),
  
  -- Leave requests
  ('leave_create', 'leave_requests', 'create', 'Create leave requests'),
  ('leave_read', 'leave_requests', 'read', 'View leave requests'),
  ('leave_approve', 'leave_requests', 'approve', 'Approve leave requests')
ON CONFLICT (name) DO NOTHING;
