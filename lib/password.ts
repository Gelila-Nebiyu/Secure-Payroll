// Password validation and hashing utilities
import { hash, verify } from "argon2"

// Password policy configuration
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  maxLength: 128,
}

// Common passwords to disallow (subset - in production, use a larger list)
const COMMON_PASSWORDS = [
  "password123",
  "123456789012",
  "qwertyuiop12",
  "password1234",
  "letmein12345",
  "welcome12345",
  "admin1234567",
  "iloveyou1234",
]

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: "weak" | "fair" | "good" | "strong"
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let strengthScore = 0

  // Length check
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`)
  } else {
    strengthScore += 1
    if (password.length >= 16) strengthScore += 1
  }

  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_POLICY.maxLength} characters`)
  }

  // Uppercase check
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  } else if (/[A-Z]/.test(password)) {
    strengthScore += 1
  }

  // Lowercase check
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  } else if (/[a-z]/.test(password)) {
    strengthScore += 1
  }

  // Numbers check
  if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  } else if (/[0-9]/.test(password)) {
    strengthScore += 1
  }

  // Symbols check
  if (PASSWORD_POLICY.requireSymbols && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*...)")
  } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    strengthScore += 1
  }

  // Common password check
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push("This password is too common. Please choose a different one.")
  }

  // Determine strength
  let strength: "weak" | "fair" | "good" | "strong"
  if (strengthScore <= 2) strength = "weak"
  else if (strengthScore <= 4) strength = "fair"
  else if (strengthScore <= 5) strength = "good"
  else strength = "strong"

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

// Hash password using Argon2id
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    type: 2, // Argon2id
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  })
}

// Verify password against hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await verify(hashedPassword, password)
  } catch {
    return false
  }
}
