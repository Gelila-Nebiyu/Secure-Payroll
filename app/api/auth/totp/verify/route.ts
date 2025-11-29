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
      return NextResponse.json({ error: "Please enter a valid 6-digit code" }, { status: 400 })
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

    if (!profile?.totp_secret) {
      return NextResponse.json(
        { error: "TOTP enrollment not started. Please start enrollment first." },
        { status: 400 },
      )
    }

    // Verify the token
    const isValid = await verifyTOTPToken(profile.totp_secret, token)

    if (!isValid) {
      await logAuditEvent({
        userId: user.id,
        action: "totp_verification_failed",
        result: "denied",
        ipAddress,
        userAgent,
      })

      return NextResponse.json({ error: "Invalid verification code. Please try again." }, { status: 400 })
    }

    // Enable TOTP
    await adminSupabase.from("profiles").update({ totp_enabled: true }).eq("id", user.id)

    await logAuditEvent({
      userId: user.id,
      action: "totp_enabled",
      result: "success",
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Two-factor authentication has been enabled successfully",
      totpEnabled: true,
    })
  } catch (error) {
    console.error("TOTP verification error:", error)
    return NextResponse.json({ error: "Failed to verify TOTP token" }, { status: 500 })
  }
}
