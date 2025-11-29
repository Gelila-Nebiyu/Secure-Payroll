import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createSession } from "@/lib/auth/session"
import { auditLog } from "@/lib/audit-logger"
import { cookies } from "next/headers"

const rpID = process.env.WEBAUTHN_RP_ID || "localhost"
const expectedOrigin = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential, userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get the challenge from the cookie
    const cookieStore = await cookies()
    const challengeCookie = cookieStore.get("webauthn_auth_challenge")

    if (!challengeCookie) {
      return NextResponse.json({ error: "Challenge not found. Please restart authentication." }, { status: 400 })
    }

    const expectedChallenge = challengeCookie.value

    // Get user's stored credentials
    const supabase = await createServerSupabaseClient()
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, webauthn_credentials, status, locked_until")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json(
        {
          error: "Account is locked",
          lockedUntil: user.locked_until,
        },
        { status: 403 },
      )
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 })
    }

    // Find the matching credential
    const storedCredentials = user.webauthn_credentials || []
    const matchingCredential = storedCredentials.find((cred: { id: string }) => cred.id === credential.id)

    if (!matchingCredential) {
      await auditLog({
        userId: user.id,
        action: "webauthn_auth",
        resourceType: "auth",
        result: "failed",
        metadata: { reason: "credential_not_found" },
      })
      return NextResponse.json({ error: "Credential not recognized" }, { status: 400 })
    }

    // Verify the authentication response
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: matchingCredential.id,
        publicKey: Buffer.from(matchingCredential.publicKey, "base64"),
        counter: matchingCredential.counter,
        transports: matchingCredential.transports,
      },
      requireUserVerification: true,
    })

    if (!verification.verified) {
      await auditLog({
        userId: user.id,
        action: "webauthn_auth",
        resourceType: "auth",
        result: "failed",
        metadata: { reason: "verification_failed" },
      })
      return NextResponse.json({ error: "Authentication failed" }, { status: 400 })
    }

    // Update the credential counter
    matchingCredential.counter = verification.authenticationInfo.newCounter
    const updatedCredentials = storedCredentials.map((cred: { id: string }) =>
      cred.id === matchingCredential.id ? matchingCredential : cred,
    )

    await supabase.from("users").update({ webauthn_credentials: updatedCredentials }).eq("id", user.id)

    // Clear the challenge cookie
    cookieStore.delete("webauthn_auth_challenge")

    // Create session
    await createSession(user.id)

    await auditLog({
      userId: user.id,
      action: "webauthn_auth",
      resourceType: "auth",
      result: "success",
      metadata: { method: "webauthn" },
    })

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      redirectTo: "/dashboard",
    })
  } catch (error) {
    console.error("WebAuthn auth verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
