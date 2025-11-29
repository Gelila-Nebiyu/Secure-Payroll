-- Part 6: Payroll and Leave Management Tables

-- Payroll records
CREATE TABLE IF NOT EXISTS payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL,
  overtime_pay DECIMAL(12,2) DEFAULT 0,
  deductions DECIMAL(12,2) DEFAULT 0,
  net_salary DECIMAL(12,2) NOT NULL,
  tax_info JSONB DEFAULT '{}'::jsonb,
  label_id UUID NOT NULL REFERENCES data_labels(id),
  status TEXT DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access requests (for requesting higher access levels)
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  requested_action permission_action NOT NULL,
  reason TEXT,
  status request_status DEFAULT 'pending',
  approver_id UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Payroll policies
CREATE POLICY "payroll_select_own" ON payroll_records
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "payroll_admin_select" ON payroll_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator', 'HR Manager', 'Finance Manager', 'Payroll Officer')
    )
  );

CREATE POLICY "payroll_create_authorized" ON payroll_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator', 'HR Manager', 'Payroll Officer')
    )
  );

-- Leave request policies
CREATE POLICY "leave_select_own" ON leave_requests
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "leave_insert_own" ON leave_requests
  FOR INSERT WITH CHECK (employee_id = auth.uid());

CREATE POLICY "leave_manager_select" ON leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator', 'HR Manager', 'Department Head')
    )
  );

-- Access request policies
CREATE POLICY "access_request_select_own" ON access_requests
  FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "access_request_insert_own" ON access_requests
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "access_request_approver_select" ON access_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('System Administrator', 'HR Manager')
    )
  );
