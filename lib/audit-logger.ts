// Unified Audit Logger with Encryption
import { createServerSupabaseClient } from "./supabase/server"
import { headers } from "next/headers"
import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production-32c"

// Ensure key is 32 bytes for AES-256
function getEncryptionKey(): Buffer {
  const key = ENCRYPTION_KEY
  if (key.length >= 32) {
    return Buffer.from(key.slice(0, 32))
  }
  return Buffer.from(key.padEnd(32, "0"))
}

// Encrypt data using AES-256-GCM
export function encryptLogMetadata(data: Record<string, unknown>): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

    const jsonData = JSON.stringify(data)
    let encrypted = cipher.update(jsonData, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    // Combine IV + authTag + encrypted data
    return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    return ""
  }
}

// Decrypt data
export function decryptLogMetadata(encryptedData: string): Record<string, unknown> {
  try {
    if (!encryptedData) return {}

    const parts = encryptedData.split(":")
    if (parts.length !== 3) return {}

    const [ivHex, authTagHex, encrypted] = parts
    const key = getEncryptionKey()
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    return {}
  }
}

export interface AuditLogParams {
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  result?: "success" | "denied" | "failed" | "error"
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function auditLog(params: AuditLogParams): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get IP and user agent from headers if not provided
    let ipAddress = params.ipAddress
    let userAgent = params.userAgent

    if (!ipAddress || !userAgent) {
      try {
        const headersList = await headers()
        ipAddress = ipAddress || headersList.get("x-forwarded-for")?.split(",")[0] || "unknown"
        userAgent = userAgent || headersList.get("user-agent") || "unknown"
      } catch {
        ipAddress = ipAddress || "unknown"
        userAgent = userAgent || "unknown"
      }
    }

    // Encrypt metadata
    let encryptedMetadata: string | null = null
    if (params.metadata && Object.keys(params.metadata).length > 0) {
      encryptedMetadata = encryptLogMetadata(params.metadata)
    }

    const { error } = await supabase.from("audit_logs").insert({
      user_id: params.userId || null,
      action: params.action,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      result: params.result || "success",
      encrypted_metadata: encryptedMetadata,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.error("Audit log insert error:", error)
    }
  } catch (error) {
    // Audit logging should never break the main flow
    console.error("Audit log error:", error)
  }
}

// Log system events (startup, shutdown, config changes)
export async function logSystemEvent(
  eventType: string,
  description: string,
  metadata?: Record<string, unknown>,
  severity: "info" | "warning" | "error" | "critical" = "info",
): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient()

    let encryptedMetadata: string | null = null
    if (metadata) {
      encryptedMetadata = encryptLogMetadata(metadata)
    }

    await supabase.from("system_events").insert({
      event_type: eventType,
      description,
      encrypted_metadata: encryptedMetadata,
      severity,
    })
  } catch (error) {
    console.error("System event log error:", error)
  }
}

// Alert on critical events
export async function triggerSecurityAlert(alertType: string, details: Record<string, unknown>): Promise<void> {
  try {
    // Log to system events with critical severity
    await logSystemEvent(`security_alert_${alertType}`, `Security alert: ${alertType}`, details, "critical")

    // In production, this would also:
    // - Send email to security team
    // - Push to external monitoring (Logflare, Datadog, etc.)
    // - Trigger webhook notifications
    console.warn(`[SECURITY ALERT] ${alertType}:`, details)
  } catch (error) {
    console.error("Security alert error:", error)
  }
}
