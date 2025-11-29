import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { auditLog, decryptLogMetadata } from "@/lib/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role or audit_read permission
    const supabase = await createServerSupabaseClient()
    const { data: userRoles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const isAdmin = userRoles?.some(
      (ur: { roles: { name: string }[] }) =>
        ur.roles?.some((r: { name: string }) => r.name === "System Administrator" || r.name === "Security Auditor"),
    )

    if (!isAdmin) {
      await auditLog({
        userId: user.id,
        action: "audit_logs_access",
        resourceType: "audit_logs",
        result: "denied",
        metadata: { reason: "insufficient_permissions" },
      })
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const resourceType = searchParams.get("resource_type")
    const result = searchParams.get("result")
    const userId = searchParams.get("user_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const exportFormat = searchParams.get("export")

    let query = supabase
      .from("audit_logs")
      .select(`
        id,
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address,
        user_agent,
        result,
        encrypted_metadata,
        created_at,
        users(username)
      `)
      .order("created_at", { ascending: false })
      .limit(500)

    if (action) query = query.eq("action", action)
    if (resourceType) query = query.eq("resource_type", resourceType)
    if (result) query = query.eq("result", result)
    if (userId) query = query.eq("user_id", userId)
    if (startDate) query = query.gte("created_at", startDate)
    if (endDate) query = query.lte("created_at", endDate + "T23:59:59")

    const { data: logs, error } = await query

    if (error) {
      console.error("Error fetching audit logs:", error)
      return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
    }

    // Decrypt metadata for each log
    const decryptedLogs = logs?.map((log) => {
      const users = log.users as { username?: string }[] | { username?: string } | null | undefined
      const username =
        Array.isArray(users) ? users[0]?.username ?? null : (users as { username?: string } | null | undefined)?.username ?? null
      return {
        ...log,
        username,
        metadata: log.encrypted_metadata ? decryptLogMetadata(log.encrypted_metadata) : {},
        encrypted_metadata: undefined,
        users: undefined,
      }
    })

    await auditLog({
      userId: user.id,
      action: "audit_logs_access",
      resourceType: "audit_logs",
      result: "success",
      metadata: { filters: { action, resourceType, result, userId, startDate, endDate }, count: logs?.length },
    })

    if (exportFormat === "true") {
      const exportData = JSON.stringify(decryptedLogs, null, 2)
      return new NextResponse(exportData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString()}.json"`,
        },
      })
    }

    return NextResponse.json({ logs: decryptedLogs })
  } catch (error) {
    console.error("Audit logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
