// Encryption utilities for sensitive data (TOTP secrets, audit logs)
// Uses Web Crypto API for AES-GCM encryption

const ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256

// Get encryption key from environment variable
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyBase64 = process.env.ENCRYPTION_KEY
  if (!keyBase64) {
    throw new Error("ENCRYPTION_KEY environment variable is not set")
  }

  const keyBuffer = Buffer.from(keyBase64, "base64")
  return crypto.subtle.importKey("raw", keyBuffer, { name: ALGORITHM, length: KEY_LENGTH }, false, [
    "encrypt",
    "decrypt",
  ])
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedText = new TextEncoder().encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encodedText)

  // Combine IV and ciphertext, then base64 encode
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return Buffer.from(combined).toString("base64")
}

export async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey()
  const combined = Buffer.from(encryptedData, "base64")

  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext)

  return new TextDecoder().decode(decrypted)
}

// Generate a new encryption key (run once to set up)
export function generateEncryptionKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32))
  return Buffer.from(key).toString("base64")
}

// Hash function for refresh tokens
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Buffer.from(hashBuffer).toString("hex")
}
