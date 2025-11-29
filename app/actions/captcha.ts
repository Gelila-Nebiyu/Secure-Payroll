"use server"

export async function getCaptchaSiteKey(): Promise<string> {
  // hCaptcha site key is designed to be public - it's required client-side
  // The secret key (HCAPTCHA_SECRET_KEY) remains server-only
  return process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"
}
