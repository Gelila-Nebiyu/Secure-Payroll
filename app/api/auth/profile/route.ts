import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from("users")
      .select(`
        id,
        username,
        email,
        phone,
        department,
        security_label,
        mfa_enabled,
        webauthn_enabled,
        created_at,
        user_roles(roles(id, name))
      `)
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const transformedProfile = {
      ...profile,
      roles: (profile.user_roles ?? []).flatMap((ur: any) =>
        Array.isArray(ur.roles) ? ur.roles : ur.roles ? [ur.roles] : []
      ),
      user_roles: undefined,
    }

    return NextResponse.json({ user: transformedProfile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
