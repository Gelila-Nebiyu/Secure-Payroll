import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { generateWebAuthnAuthOptions, verifyWebAuthnAuthentication, type StoredCredential } from "@/lib/webauthn"
import { resetFailedAttempts } from "@/lib/account-lockout"
import { logAuditEvent } from "@/lib/audit"

// Store challenges temporarily
const authChallengeStore = new Map<string, { challenge: string; userId: string }>()

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("webauthn_credentials")
      .eq("id", userId)
      .single()

    const credentials: StoredCredential[] = profile?.webauthn_credentials || []

    if (credentials.length === 0) {
      return NextResponse.json({ error: "No passkeys registered for this account" }, { status: 400 })
    }

    const options = await generateWebAuthnAuthOptions(credentials)

    // Store challenge for verification
    authChallengeStore.set(options.challenge, { challenge: options.challenge, userId })

    return NextResponse.json(options)
  } catch (error) {
    console.error("WebAuthn auth options error:", error)
    return NextResponse.json({ error: "Failed to generate authentication options" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const body = await request.json()
    const { response, challenge } = body

    const storedData = authChallengeStore.get(challenge)
    if (!storedData) {
      return NextResponse.json({ error: "Authentication session expired. Please try again." }, { status: 400 })
    }

    const { userId } = storedData

    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("webauthn_credentials, email")
      .eq("id", userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const credentials: StoredCredential[] = profile.webauthn_credentials || []
    const credential = credentials.find((c) => c.id === response.id)

    if (!credential) {
      return NextResponse.json({ error: "Credential not found" }, { status: 400 })
    }

    const verification = await verifyWebAuthnAuthentication(response, challenge, credential)

    if (!verification.verified) {
      await logAuditEvent({
        userId,
        action: "webauthn_auth_failed",
        result: "denied",
        ipAddress,
        userAgent,
      })

      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Update credential counter
    const updatedCredentials = credentials.map((c) =>
      c.id === credential.id ? { ...c, counter: verification.authenticationInfo.newCounter } : c,
    )

    await adminSupabase.from("profiles").update({ webauthn_credentials: updatedCredentials }).eq("id", userId)

    // Clean up challenge
    authChallengeStore.delete(challenge)

    await resetFailedAttempts(userId)

    await logAuditEvent({
      userId,
      action: "login_success",
      result: "success",
      metadata: { mfaUsed: true, mfaType: "webauthn" },
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Authentication successful",
      verified: true,
      userId,
    })
  } catch (error) {
    console.error("WebAuthn authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
