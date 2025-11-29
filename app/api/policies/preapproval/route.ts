import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// POST create preapproval for rule exception
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

    // Check permission to create preapprovals
    const access = await checkAccess(user.id, "policies", "approve", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { userId, rulePolicyId, validFrom, validUntil, reason } = body

    if (!userId || !rulePolicyId || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: "User ID, rule policy ID, valid from, and valid until are required" },
        { status: 400 },
      )
    }

    const adminSupabase = await createAdminClient()

    // Verify the rule policy exists and requires preapproval
    const { data: policy } = await adminSupabase
      .from("rule_policies")
      .select("requires_preapproval")
      .eq("id", rulePolicyId)
      .single()

    if (!policy) {
      return NextResponse.json({ error: "Rule policy not found" }, { status: 404 })
    }

    if (!policy.requires_preapproval) {
      return NextResponse.json({ error: "This rule does not require preapproval" }, { status: 400 })
    }

    const { data: preapproval, error: createError } = await adminSupabase
      .from("rule_preapprovals")
      .insert({
        user_id: userId,
        rule_policy_id: rulePolicyId,
        approved_by: user.id,
        valid_from: validFrom,
        valid_until: validUntil,
        reason,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "preapproval_granted",
      resourceType: "rule_preapproval",
      resourceId: preapproval.id,
      result: "success",
      metadata: { targetUserId: userId, rulePolicyId, validFrom, validUntil, reason },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Preapproval granted successfully",
      preapproval,
    })
  } catch (error) {
    console.error("Create preapproval error:", error)
    return NextResponse.json({ error: "Failed to create preapproval" }, { status: 500 })
  }
}

// GET list preapprovals
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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Check if user can view all preapprovals
    const canViewAll = await checkAccess(user.id, "policies", "read", undefined, undefined, ipAddress)

    let query = supabase.from("rule_preapprovals").select(`
      *,
      user:profiles!rule_preapprovals_user_id_fkey (id, username, email),
      approver:profiles!rule_preapprovals_approved_by_fkey (id, username, email),
      rule_policy:rule_policies (id, name, description)
    `)

    if (!canViewAll.allowed) {
      // Only show user's own preapprovals
      query = query.eq("user_id", user.id)
    } else if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: preapprovals, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preapprovals })
  } catch (error) {
    console.error("Get preapprovals error:", error)
    return NextResponse.json({ error: "Failed to fetch preapprovals" }, { status: 500 })
  }
}
