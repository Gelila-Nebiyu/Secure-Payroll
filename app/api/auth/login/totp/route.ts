import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { verifyTOTPToken } from "@/lib/totp"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { resetFailedAttempts, recordFailedLogin } from "@/lib/account-lockout"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  // Rate limiting for TOTP attempts
  const rateLimit = checkRateLimit(`totp:${ipAddress}`, RATE_LIMITS.totp)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many verification attempts. Please try again later." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { userId, email, password, token } = body

    if (!userId || !email || !password || !token) {
      return NextResponse.json({ error: "User ID, email, password, and TOTP token are required" }, { status: 400 })
    }

    // Validate token format (6 digits)
    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: "Invalid token format. Please enter a 6-digit code." }, { status: 400 })
    }

    // Get user's TOTP secret using admin client
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("totp_secret, totp_enabled")
      .eq("id", userId)
      .single()

    if (!profile || !profile.totp_enabled || !profile.totp_secret) {
      return NextResponse.json({ error: "TOTP is not enabled for this account" }, { status: 400 })
    }

    // Verify TOTP token
    const isValid = await verifyTOTPToken(profile.totp_secret, token)

    if (!isValid) {
      await recordFailedLogin(userId, ipAddress)

      await logAuditEvent({
        userId,
        action: "totp_verification_failed",
        result: "denied",
        ipAddress,
        userAgent,
      })

      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 })
    }

    // TOTP verified - complete login
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    await resetFailedAttempts(userId)

    await logAuditEvent({
      userId,
      action: "login_success",
      result: "success",
      metadata: { mfaUsed: true, mfaType: "totp" },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        accessToken: data.session.access_token,
        expiresAt: data.session.expires_at,
      },
    })
  } catch (error) {
    console.error("TOTP verification error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
