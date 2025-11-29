import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// POST approve or deny access request
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Check approval permission
    const access = await checkAccess(user.id, "access_requests", "approve", id, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { approved, reason } = body

    const adminSupabase = await createAdminClient()

    // Get the request
    const { data: accessRequest } = await adminSupabase.from("access_requests").select("*").eq("id", id).single()

    if (!accessRequest) {
      return NextResponse.json({ error: "Access request not found" }, { status: 404 })
    }

    if (accessRequest.status !== "pending") {
      return NextResponse.json({ error: "This request has already been processed" }, { status: 400 })
    }

    // Update request status
    const newStatus = approved ? "approved" : "denied"
    const { error: updateError } = await adminSupabase
      .from("access_requests")
      .update({
        status: newStatus,
        approver_id: user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // If approved, grant the DAC permission
    if (approved && accessRequest.resource_id) {
      await adminSupabase.from("dac_permissions").insert({
        owner_user_id: user.id,
        resource_type: accessRequest.resource_type,
        resource_id: accessRequest.resource_id,
        grantee_user_id: accessRequest.requester_id,
        permission: accessRequest.requested_action,
      })
    }

    await logAuditEvent({
      userId: user.id,
      action: `access_request_${newStatus}`,
      resourceType: "access_request",
      resourceId: id,
      result: "success",
      metadata: {
        requesterId: accessRequest.requester_id,
        resourceType: accessRequest.resource_type,
        requestedAction: accessRequest.requested_action,
        approverReason: reason,
      },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: `Access request ${newStatus}`,
      status: newStatus,
    })
  } catch (error) {
    console.error("Process access request error:", error)
    return NextResponse.json({ error: "Failed to process access request" }, { status: 500 })
  }
}
