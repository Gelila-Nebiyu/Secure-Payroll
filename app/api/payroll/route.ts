import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { checkAccess } from "@/lib/policy-engine"
import { auditLog } from "@/lib/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user's full profile with roles
    const { data: userProfile } = await supabase
      .from("users")
      .select(`
        *,
        user_roles(roles(name, permissions:role_permissions(permissions(name, resource, action))))
      `)
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

    // Check base access to payroll resource
    const accessResult = await checkAccess(userContext, "payroll", "read")

    if (!accessResult.allowed) {
      await auditLog({
        userId: user.id,
        action: "payroll_list",
        resourceType: "payroll",
        result: "denied",
        metadata: { reason: accessResult.reason, policy: accessResult.matchedPolicy },
      })
      return NextResponse.json({ error: "Access denied", reason: accessResult.reason }, { status: 403 })
    }

    // Fetch payroll records based on MAC clearance
    let query = supabase
      .from("payroll_records")
      .select(`
        *,
        users!employee_id(username, email)
      `)
      .order("created_at", { ascending: false })

    // MAC filtering based on security label
    const labelOrder = ["public", "internal", "confidential"]
    const userLabelIndex = labelOrder.indexOf(userProfile?.security_label || "public")
    const accessibleLabels = labelOrder.slice(0, userLabelIndex + 1)

    query = query.in("security_label", accessibleLabels)

    // If not admin/HR, only show own records
    const isPrivileged = userContext.roles.some((r: string) =>
      ["System Administrator", "HR Manager", "Finance Manager", "Payroll Manager"].includes(r),
    )

    if (!isPrivileged) {
      query = query.eq("employee_id", user.id)
    }

    const { data: records, error } = await query

    if (error) {
      console.error("Error fetching payroll records:", error)
      return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
    }

    // Transform records
    const transformedRecords = records?.map((record) => ({
      ...record,
      employee_name: (record.users as { username: string; email: string } | null)?.username || null,
      users: undefined,
    }))

    await auditLog({
      userId: user.id,
      action: "payroll_list",
      resourceType: "payroll",
      result: "success",
      metadata: { recordCount: records?.length, accessLevel: userProfile?.security_label },
    })

    return NextResponse.json({ records: transformedRecords })
  } catch (error) {
    console.error("Payroll fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user context
    const { data: userProfile } = await supabase
      .from("users")
      .select(`
        *,
        user_roles(roles(name))
      `)
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
    const accessResult = await checkAccess(userContext, "payroll", "write")

    if (!accessResult.allowed) {
      await auditLog({
        userId: user.id,
        action: "payroll_create",
        resourceType: "payroll",
        result: "denied",
        metadata: { reason: accessResult.reason },
      })
      return NextResponse.json({ error: "Access denied", reason: accessResult.reason }, { status: 403 })
    }

    const body = await request.json()
    const { employee_id, salary_amount, currency, pay_period_start, pay_period_end, security_label } = body

    // Calculate taxes (simplified US tax calculation)
    const federalTax = salary_amount * 0.22
    const stateTax = salary_amount * 0.05
    const socialSecurity = salary_amount * 0.062
    const medicare = salary_amount * 0.0145
    const totalDeductions = federalTax + stateTax + socialSecurity + medicare
    const netPay = salary_amount - totalDeductions

    // Get the appropriate data label ID
    const { data: labelData } = await supabase
      .from("data_labels")
      .select("id")
      .eq("label_name", security_label)
      .single()

    const { data: record, error } = await supabase
      .from("payroll_records")
      .insert({
        employee_id,
        salary_amount,
        currency: currency || "USD",
        pay_period_start,
        pay_period_end,
        tax_info: {
          federal_tax: federalTax,
          state_tax: stateTax,
          social_security: socialSecurity,
          medicare: medicare,
        },
        deductions: 0,
        net_pay: netPay,
        status: "draft",
        security_label,
        label_id: labelData?.id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating payroll record:", error)
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
    }

    await auditLog({
      userId: user.id,
      action: "payroll_create",
      resourceType: "payroll",
      resourceId: record.id,
      result: "success",
      metadata: { employee_id, salary_amount, security_label },
    })

    return NextResponse.json({ record })
  } catch (error) {
    console.error("Payroll create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
