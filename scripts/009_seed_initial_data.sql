-- Seed Initial Data for Secure Payroll System
-- This script creates default roles, permissions, policies, and a system admin

-- Insert default security labels (MAC)
INSERT INTO data_labels (label_name, description, level) VALUES
('public', 'Public information accessible to all authenticated users', 1),
('internal', 'Internal information for regular employees', 2),
('confidential', 'Confidential information for managers and authorized personnel', 3)
ON CONFLICT (label_name) DO NOTHING;

-- Insert default roles (RBAC)
INSERT INTO roles (name, description) VALUES
('System Administrator', 'Full system access - manages users, roles, policies, and security labels'),
('Security Auditor', 'Read access to audit logs and security events'),
('HR Manager', 'Manages employee records, roles, and access requests'),
('Finance Manager', 'Access to financial reports and budget data'),
('Payroll Manager', 'Full access to payroll operations and salary data'),
('Payroll Clerk', 'Limited payroll operations - view and process'),
('Department Manager', 'Manages department employees and approves requests'),
('Employee', 'Basic employee access - view own data only')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
-- User management permissions
('users.read', 'users', 'read', 'View user profiles'),
('users.write', 'users', 'write', 'Create and update users'),
('users.delete', 'users', 'delete', 'Delete user accounts'),
('users.manage_roles', 'users', 'manage_roles', 'Assign and revoke roles'),
('users.manage_labels', 'users', 'manage_labels', 'Change security clearance labels'),

-- Payroll permissions
('payroll.read', 'payroll', 'read', 'View payroll records'),
('payroll.write', 'payroll', 'write', 'Create and update payroll records'),
('payroll.delete', 'payroll', 'delete', 'Delete payroll records'),
('payroll.approve', 'payroll', 'approve', 'Approve payroll submissions'),
('payroll.process', 'payroll', 'process', 'Process payroll payments'),

-- Role and permission management
('roles.read', 'roles', 'read', 'View roles'),
('roles.write', 'roles', 'write', 'Create and update roles'),
('roles.delete', 'roles', 'delete', 'Delete roles'),

-- Policy management
('policies.read', 'policies', 'read', 'View access policies'),
('policies.write', 'policies', 'write', 'Create and update policies'),
('policies.delete', 'policies', 'delete', 'Delete policies'),

-- Audit log access
('audit.read', 'audit', 'read', 'View audit logs'),
('audit.export', 'audit', 'export', 'Export audit logs'),

-- Access request management
('access_requests.read', 'access_requests', 'read', 'View access requests'),
('access_requests.approve', 'access_requests', 'approve', 'Approve or deny access requests'),

-- DAC permissions
('dac.grant', 'dac', 'grant', 'Grant DAC permissions to others'),
('dac.revoke', 'dac', 'revoke', 'Revoke DAC permissions')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to System Administrator (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'System Administrator'
ON CONFLICT DO NOTHING;

-- Assign permissions to Security Auditor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Security Auditor'
AND p.name IN ('audit.read', 'audit.export', 'users.read', 'roles.read', 'policies.read', 'access_requests.read')
ON CONFLICT DO NOTHING;

-- Assign permissions to HR Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'HR Manager'
AND p.name IN ('users.read', 'users.write', 'users.manage_roles', 'payroll.read', 'access_requests.read', 'access_requests.approve', 'roles.read')
ON CONFLICT DO NOTHING;

-- Assign permissions to Finance Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Finance Manager'
AND p.name IN ('payroll.read', 'payroll.approve', 'users.read', 'audit.read')
ON CONFLICT DO NOTHING;

-- Assign permissions to Payroll Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Payroll Manager'
AND p.name IN ('payroll.read', 'payroll.write', 'payroll.approve', 'payroll.process', 'users.read')
ON CONFLICT DO NOTHING;

-- Assign permissions to Payroll Clerk
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Payroll Clerk'
AND p.name IN ('payroll.read', 'payroll.write')
ON CONFLICT DO NOTHING;

-- Assign permissions to Department Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Department Manager'
AND p.name IN ('users.read', 'payroll.read', 'access_requests.read', 'access_requests.approve', 'dac.grant', 'dac.revoke')
ON CONFLICT DO NOTHING;

-- Assign permissions to Employee (basic)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Employee'
AND p.name IN ('users.read', 'payroll.read')
ON CONFLICT DO NOTHING;

-- Insert default ABAC policies
INSERT INTO abac_policies (name, description, conditions, effect, priority) VALUES
(
  'payroll_department_access',
  'Only Payroll Department employees can access payroll data',
  '{"all": [{"attr": "department", "op": "eq", "value": "Payroll"}, {"attr": "resource", "op": "eq", "value": "payroll"}]}',
  'allow',
  100
),
(
  'finance_read_payroll',
  'Finance Department can read payroll reports',
  '{"all": [{"attr": "department", "op": "eq", "value": "Finance"}, {"attr": "resource", "op": "eq", "value": "payroll"}, {"attr": "action", "op": "eq", "value": "read"}]}',
  'allow',
  90
),
(
  'manager_approve_reports',
  'Managers can approve reports in their department during business hours',
  '{"all": [{"attr": "role", "op": "in", "value": ["Department Manager", "HR Manager", "Finance Manager"]}, {"attr": "action", "op": "eq", "value": "approve"}, {"attr": "hour", "op": "between", "value": [9, 17]}]}',
  'allow',
  80
),
(
  'it_no_salary_access',
  'IT Department cannot access salary data',
  '{"all": [{"attr": "department", "op": "eq", "value": "IT"}, {"attr": "resource", "op": "eq", "value": "payroll"}, {"attr": "action", "op": "in", "value": ["read", "write"]}]}',
  'deny',
  200
)
ON CONFLICT (name) DO NOTHING;

-- Insert default Rule-Based (RuBAC) policies
INSERT INTO rule_policies (name, description, conditions, effect, priority) VALUES
(
  'business_hours_only',
  'Deny system access outside business hours (9 AM - 6 PM) unless preapproved',
  '{"any": [{"attr": "hour", "op": "lt", "value": 9}, {"attr": "hour", "op": "gt", "value": 18}]}',
  'deny',
  50
),
(
  'weekend_deny',
  'Deny access on weekends unless preapproved',
  '{"attr": "dayOfWeek", "op": "in", "value": [0, 6]}',
  'deny',
  60
),
(
  'hr_approve_extended_leave',
  'Only HR Managers can approve leave requests exceeding 10 days',
  '{"all": [{"attr": "action", "op": "eq", "value": "approve_leave"}, {"attr": "leave_days", "op": "gt", "value": 10}, {"attr": "role", "op": "neq", "value": "HR Manager"}]}',
  'deny',
  100
),
(
  'suspicious_ip_block',
  'Block access from suspicious IP ranges',
  '{"attr": "ip_suspicious", "op": "eq", "value": true}',
  'deny',
  1000
),
(
  'require_mfa_for_sensitive',
  'Require MFA for accessing confidential data',
  '{"all": [{"attr": "resource_label", "op": "eq", "value": "confidential"}, {"attr": "mfa_verified", "op": "eq", "value": false}]}',
  'deny',
  150
)
ON CONFLICT (name) DO NOTHING;

-- Create departments
INSERT INTO departments (name, description) VALUES
('Human Resources', 'HR department managing employee relations'),
('Finance', 'Finance and accounting department'),
('Payroll', 'Payroll processing department'),
('IT', 'Information Technology department'),
('Operations', 'Business operations department'),
('Executive', 'Executive management')
ON CONFLICT (name) DO NOTHING;
