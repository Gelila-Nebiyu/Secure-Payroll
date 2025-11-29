// TOTP (Time-based One-Time Password) utilities using speakeasy
import speakeasy from "speakeasy"
import QRCode from "qrcode"
import { encrypt, decrypt } from "./crypto"

const APP_NAME = "SecurePayroll"

export interface TOTPSecret {
  base32: string
  otpauth_url: string
}

export interface TOTPSetupResult {
  secret: string // Encrypted secret for storage
  qrCodeDataUrl: string
  manualEntryKey: string
}

// Generate new TOTP secret for user enrollment
export async function generateTOTPSecret(username: string): Promise<TOTPSetupResult> {
  const secret = speakeasy.generateSecret({
    name: `${APP_NAME}:${username}`,
    issuer: APP_NAME,
    length: 32,
  })

  // Encrypt the secret for database storage
  const encryptedSecret = await encrypt(secret.base32)

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!)

  return {
    secret: encryptedSecret,
    qrCodeDataUrl,
    manualEntryKey: secret.base32,
  }
}

// Verify TOTP token
export async function verifyTOTPToken(encryptedSecret: string, token: string): Promise<boolean> {
  try {
    const secret = await decrypt(encryptedSecret)

    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1, // Allow 1 step before/after for clock drift
    })
  } catch {
    return false
  }
}

// Generate current TOTP (for testing/debugging only)
export async function generateCurrentTOTP(encryptedSecret: string): Promise<string> {
  const secret = await decrypt(encryptedSecret)
  return speakeasy.totp({
    secret,
    encoding: "base32",
  })
}
