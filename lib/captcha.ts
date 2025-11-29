// hCaptcha verification
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY
const HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify"

export interface CaptchaVerifyResult {
  success: boolean
  error?: string
}

export async function verifyCaptcha(token: string): Promise<CaptchaVerifyResult> {
  if (!HCAPTCHA_SECRET) {
    console.warn("HCAPTCHA_SECRET_KEY not configured - skipping verification")
    return { success: true }
  }

  try {
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET,
        response: token,
      }),
    })

    const data = await response.json()

    if (data.success) {
      return { success: true }
    }

    return {
      success: false,
      error: data["error-codes"]?.join(", ") || "Captcha verification failed",
    }
  } catch (error) {
    console.error("Captcha verification error:", error)
    return { success: false, error: "Failed to verify captcha" }
  }
}
