import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { auditLog } from "@/lib/audit-logger"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Check admin permission
    const { data: userRoles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const isAdmin = userRoles?.some((ur: { roles: { name: string }[] }) =>
      ur.roles?.some((r: { name: string }) => r.name === "System Administrator"),
    )

    if (!isAdmin) {
      await auditLog({
        userId: user.id,
        action: "user_update",
        resourceType: "user",
        resourceId: id,
        result: "denied",
      })
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { status, security_label, department, locked_until } = body

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (security_label !== undefined) updateData.security_label = security_label
    if (department !== undefined) updateData.department = department
    if (locked_until !== undefined) updateData.locked_until = locked_until

    // Unlock user by clearing lock fields
    if (body.unlock) {
      updateData.locked_until = null
      updateData.failed_login_attempts = 0
    }

    const { data: updatedUser, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    await auditLog({
      userId: user.id,
      action: "user_update",
      resourceType: "user",
      resourceId: id,
      result: "success",
      metadata: { changes: updateData },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
