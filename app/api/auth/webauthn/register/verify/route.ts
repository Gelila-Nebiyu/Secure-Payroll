import { type NextRequest, NextResponse } from "next/server"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/session"
import { auditLog } from "@/lib/audit-logger"
import { cookies } from "next/headers"

const rpID = process.env.WEBAUTHN_RP_ID || "localhost"
const expectedOrigin = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { credential } = body

    // Get the challenge from the cookie
    const cookieStore = await cookies()
    const challengeCookie = cookieStore.get("webauthn_challenge")

    if (!challengeCookie) {
      return NextResponse.json({ error: "Challenge not found. Please restart registration." }, { status: 400 })
    }

    const expectedChallenge = challengeCookie.value

    // Verify the registration response
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
    })

    if (!verification.verified || !verification.registrationInfo) {
      await auditLog({
        userId: user.id,
        action: "webauthn_register",
        resourceType: "auth",
        result: "failed",
        metadata: { reason: "verification_failed" },
      })
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    const { credential: regCredential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

    // Store the credential in the database
    const supabase = await createServerSupabaseClient()

    const webauthnCredential = {
      id: credential.id,
      publicKey: Buffer.from(regCredential.publicKey).toString("base64"),
      counter: regCredential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: credential.response.transports || [],
      createdAt: new Date().toISOString(),
    }

    // Get existing credentials and add the new one
    const { data: userData } = await supabase.from("users").select("webauthn_credentials").eq("id", user.id).single()

    const existingCredentials = userData?.webauthn_credentials || []
    const updatedCredentials = [...existingCredentials, webauthnCredential]

    const { error } = await supabase
      .from("users")
      .update({
        webauthn_credentials: updatedCredentials,
        webauthn_enabled: true,
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error storing WebAuthn credential:", error)
      return NextResponse.json({ error: "Failed to store credential" }, { status: 500 })
    }

    // Clear the challenge cookie
    cookieStore.delete("webauthn_challenge")

    await auditLog({
      userId: user.id,
      action: "webauthn_register",
      resourceType: "auth",
      result: "success",
      metadata: { deviceType: credentialDeviceType, backedUp: credentialBackedUp },
    })

    return NextResponse.json({
      success: true,
      message: "Passkey registered successfully",
    })
  } catch (error) {
    console.error("WebAuthn verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
