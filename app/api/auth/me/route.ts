import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get full profile with roles
    const { data: profile } = await supabase
      .from("profiles")
      .select(`
        *,
        departments (name),
        user_roles (
          roles (id, name)
        )
      `)
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: profile.username,
        firstName: profile.first_name,
        lastName: profile.last_name,
        department: profile.departments?.name,
        status: profile.status,
        securityLabel: profile.security_label,
        totpEnabled: profile.totp_enabled,
        hasPasskeys: (profile.webauthn_credentials as unknown[])?.length > 0,
        roles: profile.user_roles?.map((ur: { roles: { id: string; name: string } }) => ur.roles) || [],
        createdAt: profile.created_at,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
