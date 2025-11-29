import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// GET all RuBAC policies
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

    const access = await checkAccess(user.id, "policies", "read", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { data: policies, error } = await supabase
      .from("rule_policies")
      .select("*")
      .order("priority", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ policies })
  } catch (error) {
    console.error("Get RuBAC policies error:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

// POST create RuBAC policy
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
    const { name, description, resource, action, condition, effect, priority, requiresPreapproval } = body

    if (!name || !condition) {
      return NextResponse.json({ error: "Name and condition are required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()

    const { data: policy, error: createError } = await adminSupabase
      .from("rule_policies")
      .insert({
        name,
        description,
        resource: resource || null,
        action: action || null,
        condition,
        effect: effect || "deny",
        priority: priority || 0,
        requires_preapproval: requiresPreapproval || false,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "rubac_policy_created",
      resourceType: "rule_policy",
      resourceId: policy.id,
      result: "success",
      metadata: { name, resource, action, effect, requiresPreapproval },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({ policy, message: "Policy created successfully" })
  } catch (error) {
    console.error("Create RuBAC policy error:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}
