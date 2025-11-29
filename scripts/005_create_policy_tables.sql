-- Part 5: ABAC and RuBAC Policy Tables

-- ABAC Policies (Attribute-Based Access Control)
CREATE TABLE IF NOT EXISTS abac_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  resource TEXT NOT NULL,
  action permission_action NOT NULL,
  conditions JSONB NOT NULL, -- JSON conditions for attributes
  effect policy_effect NOT NULL DEFAULT 'allow',
  priority INTEGER DEFAULT 0, -- Higher priority policies evaluated first
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RuBAC Policies (Rule-Based Access Control)
CREATE TABLE IF NOT EXISTS rule_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  resource TEXT,
  action permission_action,
  condition JSONB NOT NULL, -- Time, location, device rules
  effect policy_effect NOT NULL DEFAULT 'deny',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  requires_preapproval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-approvals for rule exceptions
CREATE TABLE IF NOT EXISTS rule_preapprovals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rule_policy_id UUID NOT NULL REFERENCES rule_policies(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES profiles(id),
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE abac_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_preapprovals ENABLE ROW LEVEL SECURITY;

-- Policies (admin only for management, authenticated for reading)
CREATE POLICY "abac_select_authenticated" ON abac_policies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rule_select_authenticated" ON rule_policies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "preapprovals_select_own" ON rule_preapprovals
  FOR SELECT USING (user_id = auth.uid());

-- Insert default ABAC policies
INSERT INTO abac_policies (name, description, resource, action, conditions, effect) VALUES
  (
    'Payroll Department Access',
    'Only Payroll department employees can access salary data',
    'payroll',
    'read',
    '{"all": [{"attr": "department", "op": "eq", "value": "Payroll"}]}',
    'allow'
  ),
  (
    'Finance Manager Payroll Access',
    'Finance managers can view all payroll data',
    'payroll',
    'read',
    '{"all": [{"attr": "role", "op": "in", "value": ["Finance Manager", "System Administrator"]}]}',
    'allow'
  ),
  (
    'Manager Report Approval',
    'Managers can approve reports during working hours only',
    'reports',
    'approve',
    '{"all": [{"attr": "role", "op": "in", "value": ["Department Head", "HR Manager", "Finance Manager"]}, {"attr": "hour", "op": "between", "value": [9, 17]}]}',
    'allow'
  )
ON CONFLICT DO NOTHING;

-- Insert default RuBAC policies
INSERT INTO rule_policies (name, description, resource, action, condition, effect, requires_preapproval) VALUES
  (
    'Working Hours Access',
    'Deny system access outside working hours (9 AM - 6 PM) unless preapproved',
    NULL,
    NULL,
    '{"time": {"after": "18:00", "before": "09:00"}}',
    'deny',
    TRUE
  ),
  (
    'HR Manager Leave Approval',
    'Only HR Managers can approve leave requests exceeding 10 days',
    'leave_requests',
    'approve',
    '{"all": [{"attr": "leave_days", "op": "gt", "value": 10}, {"attr": "role", "op": "neq", "value": "HR Manager"}]}',
    'deny',
    FALSE
  )
ON CONFLICT DO NOTHING;
