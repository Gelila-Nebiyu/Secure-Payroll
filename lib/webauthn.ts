// WebAuthn utilities for passkey/biometric authentication
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from "@simplewebauthn/server"
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  PublicKeyCredentialDescriptorJSON,
} from "@simplewebauthn/types"

// Configuration
const RP_NAME = "Secure Payroll System"
const RP_ID = process.env.WEBAUTHN_RP_ID || "localhost"
const ORIGIN = process.env.WEBAUTHN_ORIGIN || "http://localhost:3000"

export interface StoredCredential {
  id: string
  publicKey: string // Base64 encoded
  counter: number
  transports?: string[]
  createdAt: string
}

// Generate registration options for new credential
export async function generateWebAuthnRegistrationOptions(
  userId: string,
  username: string,
  existingCredentials: StoredCredential[] = [],
): Promise<ReturnType<typeof generateRegistrationOptions>> {
  const excludeCredentials: PublicKeyCredentialDescriptorJSON[] = existingCredentials.map((cred) => ({
    id: cred.id,
    type: "public-key",
    transports: cred.transports as AuthenticatorTransport[] | undefined,
  }))

  return generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: new TextEncoder().encode(userId),
    userName: username,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  })
}

// Verify registration response
export async function verifyWebAuthnRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string,
): Promise<VerifiedRegistrationResponse> {
  return verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
  })
}

// Generate authentication options
export async function generateWebAuthnAuthOptions(
  credentials: StoredCredential[],
): Promise<ReturnType<typeof generateAuthenticationOptions>> {
  const allowCredentials: PublicKeyCredentialDescriptorJSON[] = credentials.map((cred) => ({
    id: cred.id,
    type: "public-key",
    transports: cred.transports as AuthenticatorTransport[] | undefined,
  }))

  return generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials,
    userVerification: "preferred",
  })
}

// Verify authentication response
export async function verifyWebAuthnAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credential: StoredCredential,
): Promise<VerifiedAuthenticationResponse> {
  return verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    credential: {
      id: credential.id,
      publicKey: Buffer.from(credential.publicKey, "base64"),
      counter: credential.counter,
    },
  })
}
