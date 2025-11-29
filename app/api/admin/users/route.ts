import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Check admin permission
    const { data: userRoles } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id)

    const isAdmin = userRoles?.some(
      (ur: { roles: { name: string }[] }) =>
        ur.roles?.some((r: { name: string }) => r.name === "System Administrator" || r.name === "HR Manager"),
    )

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        username,
        email,
        phone,
        department,
        security_label,
        status,
        mfa_enabled,
        webauthn_enabled,
        failed_login_attempts,
        locked_until,
        created_at,
        user_roles(
          roles(id, name)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
    // Transform the data
    const transformedUsers = users?.map((u) => ({
      ...u,
      roles: u.user_roles?.flatMap((ur: { roles: { id: string; name: string }[] }) => ur.roles || []) || [],
      user_roles: undefined,
    }))

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
