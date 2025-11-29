import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// POST assign role to user
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: roleId } = await params
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check permission to assign roles
    const access = await checkAccess(user.id, "roles", "update", roleId, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { userId, expiresAt } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Check if assignment already exists
    const { data: existing } = await adminSupabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role_id", roleId)
      .single()

    if (existing) {
      return NextResponse.json({ error: "User already has this role" }, { status: 400 })
    }

    // Create assignment
    const { data: assignment, error: assignError } = await adminSupabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role_id: roleId,
        assigned_by: user.id,
        expires_at: expiresAt || null,
      })
      .select()
      .single()

    if (assignError) {
      return NextResponse.json({ error: assignError.message }, { status: 500 })
    }

    // Log to role assignment audit trail
    await adminSupabase.from("role_assignment_logs").insert({
      user_id: userId,
      role_id: roleId,
      action: "assigned",
      performed_by: user.id,
    })

    await logAuditEvent({
      userId: user.id,
      action: "role_assigned",
      resourceType: "user_role",
      resourceId: assignment.id,
      result: "success",
      metadata: { targetUserId: userId, roleId, expiresAt },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Role assigned successfully",
      assignment,
    })
  } catch (error) {
    console.error("Assign role error:", error)
    return NextResponse.json({ error: "Failed to assign role" }, { status: 500 })
  }
}

// DELETE revoke role from user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: roleId } = await params
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const access = await checkAccess(user.id, "roles", "update", roleId, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    const { error: deleteError } = await adminSupabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", roleId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Log to role assignment audit trail
    await adminSupabase.from("role_assignment_logs").insert({
      user_id: userId,
      role_id: roleId,
      action: "revoked",
      performed_by: user.id,
    })

    await logAuditEvent({
      userId: user.id,
      action: "role_revoked",
      resourceType: "user_role",
      result: "success",
      metadata: { targetUserId: userId, roleId },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ message: "Role revoked successfully" })
  } catch (error) {
    console.error("Revoke role error:", error)
    return NextResponse.json({ error: "Failed to revoke role" }, { status: 500 })
  }
}
