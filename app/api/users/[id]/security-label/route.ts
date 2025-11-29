import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"
import { logAuditEvent } from "@/lib/audit"

// PUT update user's security label (MAC)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params
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

    // Only System Administrators can change security labels
    const access = await checkAccess(user.id, "users", "update", userId, "confidential", ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: "Only System Administrators can modify security labels" }, { status: 403 })
    }

    const body = await request.json()
    const { securityLabel } = body

    const validLabels = ["public", "internal", "confidential"]
    if (!securityLabel || !validLabels.includes(securityLabel)) {
      return NextResponse.json(
        { error: "Invalid security label. Must be: public, internal, or confidential" },
        { status: 400 },
      )
    }

    const adminSupabase = await createAdminClient()

    // Get current label for audit
    const { data: currentProfile } = await adminSupabase
      .from("profiles")
      .select("security_label")
      .eq("id", userId)
      .single()

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({ security_label: securityLabel })
      .eq("id", userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await logAuditEvent({
      userId: user.id,
      action: "security_label_changed",
      resourceType: "user",
      resourceId: userId,
      result: "success",
      metadata: {
        previousLabel: currentProfile?.security_label,
        newLabel: securityLabel,
      },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Security label updated successfully",
      securityLabel,
    })
  } catch (error) {
    console.error("Update security label error:", error)
    return NextResponse.json({ error: "Failed to update security label" }, { status: 500 })
  }
}
