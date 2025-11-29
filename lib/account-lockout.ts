// Account lockout management
import { createAdminClient } from "./supabase/server"
import { logAuditEvent } from "./audit"

const LOCKOUT_THRESHOLDS = [
  { attempts: 3, duration: 5 * 60 * 1000 }, // 5 minutes after 3 attempts
  { attempts: 5, duration: 30 * 60 * 1000 }, // 30 minutes after 5 attempts
  { attempts: 10, duration: 24 * 60 * 60 * 1000 }, // 24 hours after 10 attempts
]

export interface LockoutStatus {
  isLocked: boolean
  lockedUntil: Date | null
  failedAttempts: number
  remainingAttempts: number
}

export async function checkAccountLockout(userId: string): Promise<LockoutStatus> {
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("failed_login_attempts, locked_until")
    .eq("id", userId)
    .single()

  if (!profile) {
    return {
      isLocked: false,
      lockedUntil: null,
      failedAttempts: 0,
      remainingAttempts: LOCKOUT_THRESHOLDS[0].attempts,
    }
  }

  const now = new Date()
  const lockedUntil = profile.locked_until ? new Date(profile.locked_until) : null
  const isLocked = lockedUntil !== null && lockedUntil > now

  // Calculate remaining attempts
  let remainingAttempts = LOCKOUT_THRESHOLDS[0].attempts - profile.failed_login_attempts
  for (const threshold of LOCKOUT_THRESHOLDS) {
    if (profile.failed_login_attempts < threshold.attempts) {
      remainingAttempts = threshold.attempts - profile.failed_login_attempts
      break
    }
  }

  return {
    isLocked,
    lockedUntil,
    failedAttempts: profile.failed_login_attempts,
    remainingAttempts: Math.max(0, remainingAttempts),
  }
}

export async function recordFailedLogin(userId: string, ipAddress: string): Promise<LockoutStatus> {
  const supabase = await createAdminClient()

  // Increment failed attempts
  const { data: profile } = await supabase.from("profiles").select("failed_login_attempts").eq("id", userId).single()

  const newAttempts = (profile?.failed_login_attempts ?? 0) + 1

  // Determine lockout duration
  let lockoutDuration = 0
  for (const threshold of LOCKOUT_THRESHOLDS) {
    if (newAttempts >= threshold.attempts) {
      lockoutDuration = threshold.duration
    }
  }

  const lockedUntil = lockoutDuration > 0 ? new Date(Date.now() + lockoutDuration) : null

  await supabase
    .from("profiles")
    .update({
      failed_login_attempts: newAttempts,
      locked_until: lockedUntil?.toISOString(),
    })
    .eq("id", userId)

  // Log the event
  await logAuditEvent({
    userId,
    action: "login_failed",
    result: "denied",
    metadata: { attempts: newAttempts, locked: !!lockedUntil },
    ipAddress,
  })

  return checkAccountLockout(userId)
}

export async function resetFailedAttempts(userId: string): Promise<void> {
  const supabase = await createAdminClient()

  await supabase
    .from("profiles")
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    })
    .eq("id", userId)
}

export async function adminUnlockAccount(userId: string, adminId: string, ipAddress: string): Promise<void> {
  const supabase = await createAdminClient()

  await supabase
    .from("profiles")
    .update({
      failed_login_attempts: 0,
      locked_until: null,
    })
    .eq("id", userId)

  await logAuditEvent({
    userId: adminId,
    action: "admin_unlock_account",
    resourceType: "user",
    resourceId: userId,
    result: "success",
    ipAddress,
  })
}
