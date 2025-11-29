import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { generateWebAuthnRegistrationOptions, verifyWebAuthnRegistration, type StoredCredential } from "@/lib/webauthn"
import { logAuditEvent } from "@/lib/audit"

// Store challenges temporarily (in production, use Redis or DB)
const challengeStore = new Map<string, string>()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("username, webauthn_credentials")
      .eq("id", user.id)
      .single()

    const existingCredentials: StoredCredential[] = profile?.webauthn_credentials || []

    const options = await generateWebAuthnRegistrationOptions(
      user.id,
      profile?.username || user.email || "user",
      existingCredentials,
    )

    // Store challenge for verification
    challengeStore.set(user.id, options.challenge)

    return NextResponse.json(options)
  } catch (error) {
    console.error("WebAuthn registration options error:", error)
    return NextResponse.json({ error: "Failed to generate registration options" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"

  try {
    const body = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const expectedChallenge = challengeStore.get(user.id)
    if (!expectedChallenge) {
      return NextResponse.json({ error: "Registration session expired. Please try again." }, { status: 400 })
    }

    const verification = await verifyWebAuthnRegistration(body, expectedChallenge)

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: "Registration verification failed" }, { status: 400 })
    }

    // Store the credential
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("webauthn_credentials")
      .eq("id", user.id)
      .single()

    const existingCredentials: StoredCredential[] = profile?.webauthn_credentials || []

    const newCredential: StoredCredential = {
      id: verification.registrationInfo.credential.id,
      publicKey: Buffer.from(verification.registrationInfo.credential.publicKey).toString("base64"),
      counter: verification.registrationInfo.credential.counter,
      transports: body.response.transports,
      createdAt: new Date().toISOString(),
    }

    await adminSupabase
      .from("profiles")
      .update({
        webauthn_credentials: [...existingCredentials, newCredential],
      })
      .eq("id", user.id)

    // Clean up challenge
    challengeStore.delete(user.id)

    await logAuditEvent({
      userId: user.id,
      action: "webauthn_credential_registered",
      result: "success",
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      message: "Passkey registered successfully",
      verified: true,
    })
  } catch (error) {
    console.error("WebAuthn registration error:", error)
    return NextResponse.json({ error: "Failed to register passkey" }, { status: 500 })
  }
}
