import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { checkAccess } from "@/lib/policy-engine"
import { auditLog } from "@/lib/audit-logger"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user context
    const { data: userProfile } = await supabase
      .from("users")
      .select(`*, user_roles(roles(name))`)
      .eq("id", user.id)
      .single()

    const userContext = {
      userId: user.id,
      securityLabel: userProfile?.security_label || "public",
      department: userProfile?.department,
      roles: userProfile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || [],
      attributes: userProfile?.attributes || {},
      employmentStatus: userProfile?.employment_status || "active",
      location: userProfile?.location || null,
    }

    // Check read access
    const accessResult = await checkAccess(userContext, "payroll", "read", id)

    if (!accessResult.allowed) {
      await auditLog({
        userId: user.id,
        action: "payroll_read",
        resourceType: "payroll",
        resourceId: id,
        result: "denied",
        metadata: { reason: accessResult.reason },
      })
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch the record
    const { data: record, error } = await supabase
      .from("payroll_records")
      .select(`*, users!employee_id(username, email)`)
      .eq("id", id)
      .single()

    if (error || !record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Check MAC - user's label must be >= record's label
    const labelOrder = ["public", "internal", "confidential"]
    const userLabelIndex = labelOrder.indexOf(userProfile?.security_label || "public")
    const recordLabelIndex = labelOrder.indexOf(record.security_label)

    if (userLabelIndex < recordLabelIndex) {
      await auditLog({
        userId: user.id,
        action: "payroll_read",
        resourceType: "payroll",
        resourceId: id,
        result: "denied",
        metadata: { reason: "mac_clearance_insufficient" },
      })
      return NextResponse.json({ error: "Insufficient security clearance" }, { status: 403 })
    }

    await auditLog({
      userId: user.id,
      action: "payroll_read",
      resourceType: "payroll",
      resourceId: id,
      result: "success",
    })

    return NextResponse.json({ record })
  } catch (error) {
    console.error("Payroll fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user context
    const { data: userProfile } = await supabase
      .from("users")
      .select(`*, user_roles(roles(name))`)
      .eq("id", user.id)
      .single()

    const userContext = {
      userId: user.id,
      securityLabel: userProfile?.security_label || "public",
      department: userProfile?.department,
      roles: userProfile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || [],
      attributes: userProfile?.attributes || {},
      employmentStatus: userProfile?.employment_status || "active",
      location: userProfile?.location || null,
    }

    // Check write access
    const accessResult = await checkAccess(userContext, "payroll", "write", id)

    if (!accessResult.allowed) {
      await auditLog({
        userId: user.id,
        action: "payroll_update",
        resourceType: "payroll",
        resourceId: id,
        result: "denied",
        metadata: { reason: accessResult.reason },
      })
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body = await request.json()
    const { salary_amount, status, security_label, tax_info, deductions } = body

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (salary_amount !== undefined) {
      updateData.salary_amount = salary_amount
      // Recalculate taxes
      const federalTax = salary_amount * 0.22
      const stateTax = salary_amount * 0.05
      const socialSecurity = salary_amount * 0.062
      const medicare = salary_amount * 0.0145
      updateData.tax_info = {
        federal_tax: federalTax,
        state_tax: stateTax,
        social_security: socialSecurity,
        medicare: medicare,
      }
      updateData.net_pay = salary_amount - (federalTax + stateTax + socialSecurity + medicare + (deductions || 0))
    }
    if (status !== undefined) updateData.status = status
    if (security_label !== undefined) updateData.security_label = security_label
    if (tax_info !== undefined) updateData.tax_info = tax_info
    if (deductions !== undefined) updateData.deductions = deductions

    const { data: record, error } = await supabase
      .from("payroll_records")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating payroll record:", error)
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
    }

    await auditLog({
      userId: user.id,
      action: "payroll_update",
      resourceType: "payroll",
      resourceId: id,
      result: "success",
      metadata: { changes: Object.keys(updateData) },
    })

    return NextResponse.json({ record })
  } catch (error) {
    console.error("Payroll update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user context
    const { data: userProfile } = await supabase
      .from("users")
      .select(`*, user_roles(roles(name))`)
      .eq("id", user.id)
      .single()

    const userContext = {
      userId: user.id,
      securityLabel: userProfile?.security_label || "public",
      department: userProfile?.department,
      roles: userProfile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || [],
      attributes: userProfile?.attributes || {},
      employmentStatus: userProfile?.employment_status || "active",
      location: userProfile?.location || null,
    }

    // Check delete access
    const accessResult = await checkAccess(userContext, "payroll", "delete", id)

    if (!accessResult.allowed) {
      await auditLog({
        userId: user.id,
        action: "payroll_delete",
        resourceType: "payroll",
        resourceId: id,
        result: "denied",
        metadata: { reason: accessResult.reason },
      })
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { error } = await supabase.from("payroll_records").delete().eq("id", id)

    if (error) {
      console.error("Error deleting payroll record:", error)
      return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
    }

    await auditLog({
      userId: user.id,
      action: "payroll_delete",
      resourceType: "payroll",
      resourceId: id,
      result: "success",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payroll delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
