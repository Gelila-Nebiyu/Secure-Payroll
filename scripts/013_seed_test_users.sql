-- Seed Test Users for Access Control Testing
-- Run this AFTER registering users through the app, then execute this script to assign them roles
-- 
-- IMPORTANT: First register these users through the /register page with these emails:
-- 1. admin@company.com (password: Admin123!@#)
-- 2. hr.manager@company.com (password: HrManager123!@#)
-- 3. payroll.manager@company.com (password: Payroll123!@#)
-- 4. finance.manager@company.com (password: Finance123!@#)
-- 5. auditor@company.com (password: Auditor123!@#)
-- 6. employee@company.com (password: Employee123!@#)
-- 7. dept.manager@company.com (password: DeptMgr123!@#)
--
-- After registration, run this script to assign roles and security labels

-- Assign System Administrator role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'admin@company.com' AND r.name = 'System Administrator'
ON CONFLICT DO NOTHING;

-- Assign HR Manager role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'hr.manager@company.com' AND r.name = 'HR Manager'
ON CONFLICT DO NOTHING;

-- Assign Payroll Manager role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'payroll.manager@company.com' AND r.name = 'Payroll Manager'
ON CONFLICT DO NOTHING;

-- Assign Finance Manager role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'finance.manager@company.com' AND r.name = 'Finance Manager'
ON CONFLICT DO NOTHING;

-- Assign Security Auditor role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'auditor@company.com' AND r.name = 'Security Auditor'
ON CONFLICT DO NOTHING;

-- Assign Employee role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'employee@company.com' AND r.name = 'Employee'
ON CONFLICT DO NOTHING;

-- Assign Department Manager role
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id
FROM profiles p, roles r
WHERE p.email = 'dept.manager@company.com' AND r.name = 'Department Manager'
ON CONFLICT DO NOTHING;

-- Update profiles with departments and security labels
UPDATE profiles SET 
  department = 'Executive',
  security_label = 'confidential',
  employment_status = 'active',
  first_name = 'System',
  last_name = 'Admin'
WHERE email = 'admin@company.com';

UPDATE profiles SET 
  department = 'Human Resources',
  security_label = 'confidential',
  employment_status = 'active',
  first_name = 'HR',
  last_name = 'Manager'
WHERE email = 'hr.manager@company.com';

UPDATE profiles SET 
  department = 'Payroll',
  security_label = 'confidential',
  employment_status = 'active',
  first_name = 'Payroll',
  last_name = 'Manager'
WHERE email = 'payroll.manager@company.com';

UPDATE profiles SET 
  department = 'Finance',
  security_label = 'confidential',
  employment_status = 'active',
  first_name = 'Finance',
  last_name = 'Manager'
WHERE email = 'finance.manager@company.com';

UPDATE profiles SET 
  department = 'IT',
  security_label = 'internal',
  employment_status = 'active',
  first_name = 'Security',
  last_name = 'Auditor'
WHERE email = 'auditor@company.com';

UPDATE profiles SET 
  department = 'Operations',
  security_label = 'internal',
  employment_status = 'active',
  first_name = 'John',
  last_name = 'Employee'
WHERE email = 'employee@company.com';

UPDATE profiles SET 
  department = 'Operations',
  security_label = 'confidential',
  employment_status = 'active',
  first_name = 'Department',
  last_name = 'Manager'
WHERE email = 'dept.manager@company.com';
