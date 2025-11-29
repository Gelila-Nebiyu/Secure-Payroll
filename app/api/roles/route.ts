import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// GET all roles
export async function GET(request: NextRequest) {
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

    // Check read permission
    const access = await checkAccess(user.id, "roles", "read", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { data: roles, error } = await supabase
      .from("roles")
      .select(`
        *,
        role_permissions (
          permissions (*)
        )
      `)
      .order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ roles })
  } catch (error) {
    console.error("Get roles error:", error)
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

// POST create new role
export async function POST(request: NextRequest) {
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

    // Check create permission
    const access = await checkAccess(user.id, "roles", "create", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, permissionIds } = body

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Create role
    const { data: role, error: roleError } = await adminSupabase
      .from("roles")
      .insert({ name, description })
      .select()
      .single()

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 500 })
    }

    // Assign permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissions = permissionIds.map((permId: string) => ({
        role_id: role.id,
        permission_id: permId,
      }))

      await adminSupabase.from("role_permissions").insert(rolePermissions)
    }

    await logAuditEvent({
      userId: user.id,
      action: "role_created",
      resourceType: "role",
      resourceId: role.id,
      result: "success",
      metadata: { name, permissionIds },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ role, message: "Role created successfully" })
  } catch (error) {
    console.error("Create role error:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}
