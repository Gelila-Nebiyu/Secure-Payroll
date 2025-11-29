import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { auditLog, logSystemEvent } from "@/lib/audit-logger"

// This endpoint triggers a backup record - actual backup is done via GitHub Actions
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Check if user is admin
    const { data: userRoles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const isAdmin = userRoles?.some((ur: { roles: { name: string }[] }) =>
      ur.roles?.some((r: { name: string }) => r.name === "System Administrator"),
    )

    if (!isAdmin) {
      await auditLog({
        userId: user.id,
        action: "backup_trigger",
        resourceType: "system",
        result: "denied",
      })
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Log backup start
    const { data: backup, error } = await supabase.rpc("log_backup_start", {
      p_backup_type: "manual",
    })

    if (error) {
      console.error("Backup log error:", error)
      return NextResponse.json({ error: "Failed to initiate backup" }, { status: 500 })
    }

    await logSystemEvent(
      "backup_initiated",
      "Manual backup triggered by admin",
      {
        backupId: backup,
        triggeredBy: user.id,
      },
      "info",
    )

    await auditLog({
      userId: user.id,
      action: "backup_trigger",
      resourceType: "system",
      result: "success",
      metadata: { backupId: backup },
    })

    return NextResponse.json({
      message: "Backup initiated",
      backupId: backup,
      note: "Actual backup runs via scheduled GitHub Action or Supabase automated backups",
    })
  } catch (error) {
    console.error("Backup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get backup history
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Check if user is admin or security auditor
    const { data: userRoles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const isAdmin = userRoles?.some((ur: { roles: { name: string }[] }) =>
      ur.roles?.some((r: { name: string }) => ["System Administrator", "Security Auditor"].includes(r.name)),
    )

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: backups, error } = await supabase
      .from("backup_history")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Backup history error:", error)
      return NextResponse.json({ error: "Failed to fetch backup history" }, { status: 500 })
    }

    return NextResponse.json({ backups })
  } catch (error) {
    console.error("Backup history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
