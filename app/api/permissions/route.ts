import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAccess } from "@/lib/policy-middleware"

// GET all permissions
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

    const access = await checkAccess(user.id, "roles", "read", undefined, undefined, ipAddress)
    if (!access.allowed) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { data: permissions, error } = await supabase
      .from("permissions")
      .select("*")
      .order("resource")
      .order("action")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ permissions })
  } catch (error) {
    console.error("Get permissions error:", error)
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
  }
}
