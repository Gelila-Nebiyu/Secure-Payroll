-- Part 2: Users and Profiles Table

-- Users/Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  department_id UUID REFERENCES departments(id),
  status user_status DEFAULT 'pending',
  security_label security_label DEFAULT 'public',
  
  -- MFA fields (encrypted at application level)
  totp_secret TEXT, -- Encrypted TOTP secret
  totp_enabled BOOLEAN DEFAULT FALSE,
  webauthn_credentials JSONB DEFAULT '[]'::jsonb,
  
  -- Account security
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional attributes for ABAC
  attributes JSONB DEFAULT '{}'::jsonb,
  employment_status TEXT DEFAULT 'active',
  location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can view all profiles (will be refined with role check)
CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('System Administrator', 'HR Manager')
    )
  );
