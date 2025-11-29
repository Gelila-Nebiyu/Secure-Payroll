import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validatePassword } from "@/lib/password"
import { verifyCaptcha } from "@/lib/captcha"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { logAuditEvent, logSystemEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  // Rate limiting
  const rateLimit = checkRateLimit(`register:${ipAddress}`, RATE_LIMITS.register)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { email, password, username, firstName, lastName, captchaToken } = body

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password, and username are required" }, { status: 400 })
    }

    // Verify captcha
    const captchaResult = await verifyCaptcha(captchaToken || "")
    if (!captchaResult.success) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errors.join(". ") }, { status: 400 })
    }

    const supabase = await createClient()

    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${request.nextUrl.origin}/auth/verify-email`,
        data: {
          username,
          first_name: firstName || "",
          last_name: lastName || "",
        },
      },
    })

    if (error) {
      await logAuditEvent({
        action: "registration_failed",
        result: "error",
        metadata: { email, error: error.message },
        ipAddress,
        userAgent,
      })

      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    await logAuditEvent({
      userId: data.user?.id,
      action: "user_registered",
      result: "success",
      metadata: { email, username },
      ipAddress,
      userAgent,
    })

    await logSystemEvent("user_registration", `New user registered: ${email}`, { userId: data.user?.id, email }, "info")

    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      userId: data.user?.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
