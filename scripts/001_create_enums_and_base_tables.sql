-- Secure Payroll System Database Schema
-- Part 1: Enums and Base Tables

-- Security labels for MAC (Mandatory Access Control)
CREATE TYPE security_label AS ENUM ('public', 'internal', 'confidential');

-- User status
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'locked');

-- Permission actions
CREATE TYPE permission_action AS ENUM ('create', 'read', 'update', 'delete', 'approve');

-- Access request status
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'denied');

-- Policy effect
CREATE TYPE policy_effect AS ENUM ('allow', 'deny');

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data labels for MAC
CREATE TABLE IF NOT EXISTS data_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_name security_label NOT NULL UNIQUE,
  description TEXT,
  clearance_level INTEGER NOT NULL DEFAULT 0
);

-- Insert default data labels with clearance levels
INSERT INTO data_labels (label_name, description, clearance_level) VALUES
  ('public', 'Publicly accessible information', 0),
  ('internal', 'Internal company information', 1),
  ('confidential', 'Confidential sensitive information', 2)
ON CONFLICT (label_name) DO NOTHING;

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('Human Resources', 'HR department handling employee relations'),
  ('Finance', 'Finance and accounting department'),
  ('Payroll', 'Payroll processing department'),
  ('IT', 'Information Technology department'),
  ('Management', 'Executive management')
ON CONFLICT (name) DO NOTHING;
