import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// GET single role
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"

  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const access = await checkAccess(user.id, "roles", "read", id, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { data: role, error } = await supabase
      .from("roles")
      .select(`
        *,
        role_permissions (
          permissions (*)
        ),
        user_roles (
          profiles (id, username, email)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    return NextResponse.json({ role })
  } catch (error) {
    console.error("Get role error:", error)
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 })
  }
}

// PUT update role
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

    const access = await checkAccess(user.id, "roles", "update", id, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, permissionIds } = body

    const adminSupabase = await createAdminClient()

    // Check if system role
    const { data: existingRole } = await adminSupabase.from("roles").select("is_system_role").eq("id", id).single()

    if (existingRole?.is_system_role) {
      return NextResponse.json({ error: "System roles cannot be modified" }, { status: 403 })
    }

    // Update role
    const { error: updateError } = await adminSupabase.from("roles").update({ name, description }).eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update permissions if provided
    if (permissionIds !== undefined) {
      // Remove existing permissions
      await adminSupabase.from("role_permissions").delete().eq("role_id", id)

      // Add new permissions
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map((permId: string) => ({
          role_id: id,
          permission_id: permId,
        }))
        await adminSupabase.from("role_permissions").insert(rolePermissions)
      }
    }

    await logAuditEvent({
      userId: user.id,
      action: "role_updated",
      resourceType: "role",
      resourceId: id,
      result: "success",
      metadata: { name, permissionIds },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ message: "Role updated successfully" })
  } catch (error) {
    console.error("Update role error:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

// DELETE role
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

    const access = await checkAccess(user.id, "roles", "delete", id, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const adminSupabase = await createAdminClient()

    // Check if system role
    const { data: existingRole } = await adminSupabase
      .from("roles")
      .select("is_system_role, name")
      .eq("id", id)
      .single()

    if (existingRole?.is_system_role) {
      return NextResponse.json({ error: "System roles cannot be deleted" }, { status: 403 })
    }

    const { error: deleteError } = await adminSupabase.from("roles").delete().eq("id", id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "role_deleted",
      resourceType: "role",
      resourceId: id,
      result: "success",
      metadata: { roleName: existingRole?.name },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ message: "Role deleted successfully" })
  } catch (error) {
    console.error("Delete role error:", error)
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
}
