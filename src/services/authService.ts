
import { User, LoginResult, UserRole, Department, SensitivityLevel, AuthSession } from '../types';
import { mongo } from './mockDatabase';
import { hashPassword, generateSalt, generateAuthToken, validatePasswordStrength } from './cryptoService';

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 1000;

// Temporary memory for OTPs (in a real app this would be Redis)
const otpStore: Record<string, string> = {};

export const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const existingUser = await mongo.users.findOne({ email });
  if (existingUser) {
    return { success: false, error: 'Email already registered.' };
  }

  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return { success: false, error: 'Password Policy Violation: ' + strength.errors.join(', ') };
  }

  // 1. Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  // 2. Simulate Sending Email
  const logStyle = "background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;";
  const otpStyle = "background: #ecfccb; color: #3f6212; padding: 4px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #84cc16;";

  console.group('%c [SENTINEL BACKEND] SMTP SERVICE', logStyle);
  console.log(`%c 📧 Sending Verification Email to: ${email}`, "color: #10b981; font-weight: bold;");
  console.log(`%c 🔑 VERIFICATION CODE (OTP): ${otp} `, otpStyle);
  console.groupEnd();

  // Store temp registration data in memory or generic storage until verified
  // For this demo, we create the user but mark as unverified
  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);

  const newUser: User = {
    _id: `user_${Date.now()}`, // Mongo Object ID simulation
    name,
    email,
    role: UserRole.UNASSIGNED, // Default role
    department: Department.GENERAL,
    clearanceLevel: SensitivityLevel.PUBLIC,
    avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}`,
    ipAddress: '127.0.0.1',
    passwordHash,
    salt,
    failedLoginAttempts: 0,
    lockoutUntil: null,
    mfaEnabled: false,
    lastPasswordChange: new Date().toISOString(),
    isVerified: false,
    createdAt: new Date().toISOString()
  };

  await mongo.users.insertOne(newUser);
  
  return { success: true };
};

export const verifyEmail = async (email: string, code: string): Promise<boolean> => {
  if (otpStore[email] === code) {
    const user = await mongo.users.findOne({ email });
    if (user) {
      await mongo.users.updateOne({ _id: user._id }, { isVerified: true });
      delete otpStore[email];
      return true;
    }
  }
  return false;
};

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const user = await mongo.users.findOne({ email });

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Check lockout
  if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
    const remaining = Math.ceil((user.lockoutUntil - Date.now()) / 1000);
    return { success: false, error: `Account locked. Try again in ${remaining}s.`, lockoutRemaining: remaining };
  } else if (user.lockoutUntil && user.lockoutUntil <= Date.now()) {
    await mongo.users.updateOne({ _id: user._id }, { lockoutUntil: null, failedLoginAttempts: 0 });
  }

  // Verify Password
  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    const newFailCount = user.failedLoginAttempts + 1;
    let updates: Partial<User> = { failedLoginAttempts: newFailCount };
    let error = 'Invalid email or password.';

    if (newFailCount >= MAX_FAILED_ATTEMPTS) {
      updates.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      error = `Account locked for 30s due to failed attempts.`;
    }
    
    await mongo.users.updateOne({ _id: user._id }, updates);
    return { success: false, error };
  }

  if (!user.isVerified) {
    return { success: false, error: 'Email not verified. Please register again to trigger OTP.' };
  }

  // Reset failures on success
  await mongo.users.updateOne({ _id: user._id }, { failedLoginAttempts: 0, lockoutUntil: null });

  // MFA Check
  if (user.mfaEnabled) {
    // Generate Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[user._id] = code;
    
    // Log to Console
    const logStyle = "background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;";
    const otpStyle = "background: #ecfccb; color: #3f6212; padding: 4px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #84cc16;";
    console.group('%c [SENTINEL BACKEND] SMS/MFA SERVICE', logStyle);
    console.log(`%c 📱 Sending MFA Code to User: ${user.name}`, "color: #10b981; font-weight: bold;");
    console.log(`%c 🔒 MFA CODE: ${code} `, otpStyle);
    console.groupEnd();

    return { success: true, mfaRequired: true, tempUser: user };
  }

  // Success - Generate Token
  const token = generateAuthToken();
  const session: AuthSession = {
    token,
    expiresAt: Date.now() + 3600000,
    user
  };

  return { success: true, session };
};

export const verifyMfa = async (user: User, code: string): Promise<LoginResult> => {
  if (otpStore[user._id] === code) {
    delete otpStore[user._id];
    const token = generateAuthToken();
    const session: AuthSession = {
      token,
      expiresAt: Date.now() + 3600000,
      user
    };
    return { success: true, session };
  }
  return { success: false, error: 'Invalid MFA Code.' };
};

export const changePassword = async (userId: string, oldPass: string, newPass: string): Promise<{success: boolean, error?: string}> => {
  const user = await mongo.users.findOne({ _id: userId });
  if (!user) return { success: false, error: 'User not found' };

  const oldHash = hashPassword(oldPass, user.salt);
  if (oldHash !== user.passwordHash) {
    return { success: false, error: 'Current password incorrect' };
  }

  const strength = validatePasswordStrength(newPass);
  if (!strength.valid) {
    return { success: false, error: strength.errors.join(', ') };
  }

  const newSalt = generateSalt();
  const newHash = hashPassword(newPass, newSalt);

  await mongo.users.updateOne({ _id: userId }, { passwordHash: newHash, salt: newSalt, lastPasswordChange: new Date().toISOString() });
  return { success: true };
};

export const toggleMfa = async (userId: string, enabled: boolean): Promise<User | null> => {
  return await mongo.users.updateOne({ _id: userId }, { mfaEnabled: enabled });
};

// Forgot Password Flow
export const initiatePasswordReset = async (email: string): Promise<{success: boolean, error?: string}> => {
  const user = await mongo.users.findOne({ email });
  if (!user) {
    // Security: Do not reveal if email exists, but assume success for UI
    return { success: true };
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore['RESET_' + email] = code;

  const logStyle = "background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;";
  const otpStyle = "background: #ecfccb; color: #3f6212; padding: 4px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #84cc16;";
  console.group('%c [SENTINEL BACKEND] PASSWORD RESET SERVICE', logStyle);
  console.log(`%c 📧 Sending Reset Code to: ${email}`, "color: #10b981; font-weight: bold;");
  console.log(`%c 🔑 RESET CODE: ${code} `, otpStyle);
  console.groupEnd();

  return { success: true };
};

export const resetPasswordWithOtp = async (email: string, code: string, newPass: string): Promise<{success: boolean, error?: string}> => {
  if (otpStore['RESET_' + email] !== code) {
    return { success: false, error: 'Invalid reset code.' };
  }

  const user = await mongo.users.findOne({ email });
  if (!user) return { success: false, error: 'User not found.' };

  const strength = validatePasswordStrength(newPass);
  if (!strength.valid) {
    return { success: false, error: strength.errors.join(', ') };
  }

  const newSalt = generateSalt();
  const newHash = hashPassword(newPass, newSalt);
  await mongo.users.updateOne({ _id: user._id }, { passwordHash: newHash, salt: newSalt, lastPasswordChange: new Date().toISOString() });
  
  delete otpStore['RESET_' + email];
  return { success: true };
};

// Admin Functions
export const getAllUsers = async (): Promise<User[]> => {
  return await mongo.users.find({});
};

export const assignUserRole = async (adminId: string, targetUserId: string, newRole: UserRole, newDept: Department, newClearance?: SensitivityLevel): Promise<{success: boolean, error?: string}> => {
  const admin = await mongo.users.findOne({ _id: adminId });
  if (!admin || admin.role !== UserRole.ADMIN) {
    return { success: false, error: 'Unauthorized' };
  }

  const targetUser = await mongo.users.findOne({ _id: targetUserId });
  if (!targetUser) return { success: false, error: "User not found" };

  let clearanceToSet = newClearance !== undefined ? newClearance : targetUser.clearanceLevel;

  // Enforce Minimum Clearance for Sensitive Roles
  // If the desired clearance is lower than the role requirement, automatically upgrade it.
  if (newRole === UserRole.ADMIN) {
    clearanceToSet = SensitivityLevel.TOP_SECRET;
  } else if (newRole === UserRole.HR_MANAGER && clearanceToSet < SensitivityLevel.CONFIDENTIAL) {
    clearanceToSet = SensitivityLevel.CONFIDENTIAL;
  } else if (newRole === UserRole.FINANCE_MANAGER && clearanceToSet < SensitivityLevel.CONFIDENTIAL) {
    clearanceToSet = SensitivityLevel.CONFIDENTIAL;
  }

  await mongo.users.updateOne({ _id: targetUserId }, { role: newRole, department: newDept, clearanceLevel: clearanceToSet });
  return { success: true };
};

export const deleteUser = async (adminId: string, targetUserId: string): Promise<{success: boolean, error?: string}> => {
  const admin = await mongo.users.findOne({ _id: adminId });
  if (!admin || admin.role !== UserRole.ADMIN) {
    return { success: false, error: 'Unauthorized' };
  }
  if (adminId === targetUserId) {
    return { success: false, error: 'Cannot delete yourself.' };
  }

  const success = await mongo.users.deleteOne({ _id: targetUserId });
  if (success) return { success: true };
  return { success: false, error: 'User not found' };
};
