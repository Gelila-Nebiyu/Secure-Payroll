import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// POST create access request
export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { resourceType, resourceId, requestedAction, reason } = body

    if (!resourceType || !requestedAction) {
      return NextResponse.json({ error: "Resource type and requested action are required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    // Create access request
    const { data: accessRequest, error: createError } = await adminSupabase
      .from("access_requests")
      .insert({
        requester_id: user.id,
        resource_type: resourceType,
        resource_id: resourceId || null,
        requested_action: requestedAction,
        reason,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "access_request_created",
      resourceType,
      resourceId,
      result: "success",
      metadata: { requestedAction, reason },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Access request submitted successfully",
      accessRequest,
    })
  } catch (error) {
    console.error("Create access request error:", error)
    return NextResponse.json({ error: "Failed to create access request" }, { status: 500 })
  }
}

// GET list access requests
export async function GET(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"

  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const forApproval = searchParams.get("forApproval") === "true"

    // Check if user can view all requests (approvers)
    const canApprove = await checkAccess(user.id, "access_requests", "approve", undefined, undefined, ipAddress)

    let query = supabase.from("access_requests").select(`
      *,
      requester:profiles!access_requests_requester_id_fkey (id, username, email),
      approver:profiles!access_requests_approver_id_fkey (id, username, email)
    `)

    if (forApproval && canApprove.allowed) {
      // Show pending requests for approval
      query = query.eq("status", "pending")
    } else if (!canApprove.allowed) {
      // Only show user's own requests
      query = query.eq("requester_id", user.id)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: requests, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ requests, canApprove: canApprove.allowed })
  } catch (error) {
    console.error("Get access requests error:", error)
    return NextResponse.json({ error: "Failed to fetch access requests" }, { status: 500 })
  }
}
