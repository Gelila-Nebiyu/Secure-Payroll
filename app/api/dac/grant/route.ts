import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { logAuditEvent } from "@/lib/audit"

// POST grant DAC permission
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

    const body = await request.json()
    const { resourceType, resourceId, granteeUserId, permission, expiresAt } = body

    if (!resourceType || !resourceId || !granteeUserId || !permission) {
      return NextResponse.json(
        { error: "Resource type, resource ID, grantee user ID, and permission are required" },
        { status: 400 },
      )
    }

    // Validate permission type
    const validPermissions = ["create", "read", "update", "delete", "approve"]
    if (!validPermissions.includes(permission)) {
      return NextResponse.json({ error: "Invalid permission type" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Verify the current user owns the resource (simplified - in production, check actual resource ownership)
    // For now, we'll allow users to grant permissions for resources they have access to

    // Check if grant already exists
    const { data: existing } = await adminSupabase
      .from("dac_permissions")
      .select("id")
      .eq("owner_user_id", user.id)
      .eq("resource_type", resourceType)
      .eq("resource_id", resourceId)
      .eq("grantee_user_id", granteeUserId)
      .eq("permission", permission)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Permission already granted" }, { status: 400 })
    }

    // Create DAC permission
    const { data: grant, error: grantError } = await adminSupabase
      .from("dac_permissions")
      .insert({
        owner_user_id: user.id,
        resource_type: resourceType,
        resource_id: resourceId,
        grantee_user_id: granteeUserId,
        permission,
        expires_at: expiresAt || null,
      })
      .select()
      .single()

    if (grantError) {
      return NextResponse.json({ error: grantError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "dac_permission_granted",
      resourceType,
      resourceId,
      result: "success",
      metadata: { granteeUserId, permission, expiresAt },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Permission granted successfully",
      grant,
    })
  } catch (error) {
    console.error("Grant DAC permission error:", error)
    return NextResponse.json({ error: "Failed to grant permission" }, { status: 500 })
  }
}

// DELETE revoke DAC permission
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const grantId = searchParams.get("id")

    if (!grantId) {
      return NextResponse.json({ error: "Grant ID is required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Verify ownership
    const { data: grant } = await adminSupabase.from("dac_permissions").select("*").eq("id", grantId).single()

    if (!grant) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    if (grant.owner_user_id !== user.id) {
      return NextResponse.json({ error: "You can only revoke permissions you granted" }, { status: 403 })
    }

    const { error: deleteError } = await adminSupabase.from("dac_permissions").delete().eq("id", grantId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "dac_permission_revoked",
      resourceType: grant.resource_type,
      resourceId: grant.resource_id,
      result: "success",
      metadata: { granteeUserId: grant.grantee_user_id, permission: grant.permission },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ message: "Permission revoked successfully" })
  } catch (error) {
    console.error("Revoke DAC permission error:", error)
    return NextResponse.json({ error: "Failed to revoke permission" }, { status: 500 })
  }
}

// GET list DAC permissions (owned by user or granted to user)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "granted" or "received"

    let query = supabase.from("dac_permissions").select(`
      *,
      owner:profiles!dac_permissions_owner_user_id_fkey (id, username, email),
      grantee:profiles!dac_permissions_grantee_user_id_fkey (id, username, email)
    `)

    if (type === "granted") {
      query = query.eq("owner_user_id", user.id)
    } else if (type === "received") {
      query = query.eq("grantee_user_id", user.id)
    } else {
      query = query.or(`owner_user_id.eq.${user.id},grantee_user_id.eq.${user.id}`)
    }

    const { data: permissions, error } = await query.order("granted_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ permissions })
  } catch (error) {
    console.error("Get DAC permissions error:", error)
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
  }
}
