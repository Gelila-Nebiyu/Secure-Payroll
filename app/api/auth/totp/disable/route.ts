import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { verifyTOTPToken } from "@/lib/totp"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const body = await request.json()
    const { token } = body

    if (!token || !/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit code to confirm" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get TOTP secret
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("totp_secret, totp_enabled")
      .eq("id", user.id)
      .single()

    if (!profile?.totp_enabled || !profile?.totp_secret) {
      return NextResponse.json({ error: "TOTP is not enabled for this account" }, { status: 400 })
    }

    // Verify token before disabling
    const isValid = await verifyTOTPToken(profile.totp_secret, token)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Disable TOTP
    await adminSupabase
      .from("profiles")
      .update({
        totp_enabled: false,
        totp_secret: null,
      })
      .eq("id", user.id)

    await logAuditEvent({
      userId: user.id,
      action: "totp_disabled",
      result: "success",
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Two-factor authentication has been disabled",
      totpEnabled: false,
    })
  } catch (error) {
    console.error("TOTP disable error:", error)
    return NextResponse.json({ error: "Failed to disable TOTP" }, { status: 500 })
  }
}
