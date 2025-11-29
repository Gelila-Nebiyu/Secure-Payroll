// Audit logging utilities with encryption
import { createAdminClient } from "./supabase/server"
import { encrypt } from "./crypto"

export interface AuditLogEntry {
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  result: "success" | "denied" | "error"
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = await createAdminClient()

    // Encrypt sensitive metadata
    let encryptedMetadata: string | null = null
    if (entry.metadata) {
      encryptedMetadata = await encrypt(JSON.stringify(entry.metadata))
    }

    await supabase.from("audit_logs").insert({
      user_id: entry.userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      result: entry.result,
      metadata_encrypted: encryptedMetadata,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
    })
  } catch (error) {
    console.error("Failed to log audit event:", error)
    // Don't throw - audit logging should not break the main flow
  }
}

export async function logSystemEvent(
  eventType: string,
  description: string,
  metadata?: Record<string, unknown>,
  severity: "info" | "warning" | "error" | "critical" = "info",
): Promise<void> {
  try {
    const supabase = await createAdminClient()

    await supabase.from("system_events").insert({
      event_type: eventType,
      description,
      metadata,
      severity,
    })
  } catch (error) {
    console.error("Failed to log system event:", error)
  }
}
