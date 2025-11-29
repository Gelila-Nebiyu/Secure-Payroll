import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// GET all ABAC policies
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

    // Only admins can view policies
    const access = await checkAccess(user.id, "policies", "read", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { data: policies, error } = await supabase
      .from("abac_policies")
      .select("*")
      .order("priority", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ policies })
  } catch (error) {
    console.error("Get ABAC policies error:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

// POST create ABAC policy
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

    const access = await checkAccess(user.id, "policies", "create", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, resource, action, conditions, effect, priority } = body

    if (!name || !resource || !action || !conditions) {
      return NextResponse.json({ error: "Name, resource, action, and conditions are required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    const { data: policy, error: createError } = await adminSupabase
      .from("abac_policies")
      .insert({
        name,
        description,
        resource,
        action,
        conditions,
        effect: effect || "allow",
        priority: priority || 0,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "abac_policy_created",
      resourceType: "abac_policy",
      resourceId: policy.id,
      result: "success",
      metadata: { name, resource, action, effect },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ policy, message: "Policy created successfully" })
  } catch (error) {
    console.error("Create ABAC policy error:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}
