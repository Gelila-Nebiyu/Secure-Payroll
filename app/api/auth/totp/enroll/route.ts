import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { generateTOTPSecret } from "@/lib/totp"
import { logAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if TOTP is already enabled
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("username, totp_enabled")
      .eq("id", user.id)
      .single()

    if (profile?.totp_enabled) {
      return NextResponse.json({ error: "TOTP is already enabled for this account" }, { status: 400 })
    }

    // Generate new TOTP secret
    const username = profile?.username || user.email || "user"
    const totpSetup = await generateTOTPSecret(username)

    // Store encrypted secret (not enabled yet until verified)
    await adminSupabase.from("profiles").update({ totp_secret: totpSetup.secret }).eq("id", user.id)

    await logAuditEvent({
      userId: user.id,
      action: "totp_enrollment_started",
      result: "success",
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Scan the QR code with your authenticator app",
      qrCode: totpSetup.qrCodeDataUrl,
      manualEntryKey: totpSetup.manualEntryKey,
    })
  } catch (error) {
    console.error("TOTP enrollment error:", error)
    return NextResponse.json({ error: "Failed to generate TOTP secret" }, { status: 500 })
  }
}
