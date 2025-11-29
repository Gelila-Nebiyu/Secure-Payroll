import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { checkAccountLockout, recordFailedLogin, resetFailedAttempts } from "@/lib/account-lockout"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  // Rate limiting by IP
  const rateLimit = checkRateLimit(`login:${ipAddress}`, RATE_LIMITS.login)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // First, check if user exists and is locked
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, status, totp_enabled")
      .eq("email", email)
      .single()

    if (existingUser) {
      // Check lockout status
      const lockoutStatus = await checkAccountLockout(existingUser.id)
      if (lockoutStatus.isLocked) {
        return NextResponse.json(
          {
            error: `Account is locked until ${lockoutStatus.lockedUntil?.toLocaleString()}`,
            lockedUntil: lockoutStatus.lockedUntil,
          },
          { status: 423 },
        )
      }

      // Check if account is suspended
      if (existingUser.status === "suspended") {
        return NextResponse.json({ error: "Account has been suspended. Contact administrator." }, { status: 403 })
      }
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Record failed attempt if user exists
      if (existingUser) {
        const lockoutStatus = await recordFailedLogin(existingUser.id, ipAddress)

        return NextResponse.json(
          {
            error: "Invalid email or password",
            remainingAttempts: lockoutStatus.remainingAttempts,
          },
          { status: 401 },
        )
      }

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Successful password verification - check for MFA requirement
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, totp_enabled, status")
      .eq("id", data.user.id)
      .single()

    // Check if MFA is enabled
    if (profile?.totp_enabled) {
      // Don't complete login yet - require TOTP verification
      // Sign out to prevent access before MFA
      await supabase.auth.signOut()

      return NextResponse.json({
        mfaRequired: true,
        mfaType: "totp",
        userId: data.user.id,
        message: "Please enter your authenticator code",
      })
    }

    // No MFA - complete login
    await resetFailedAttempts(data.user.id)

    await logAuditEvent({
      userId: data.user.id,
      action: "login_success",
      result: "success",
      metadata: { mfaUsed: false },
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
    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
