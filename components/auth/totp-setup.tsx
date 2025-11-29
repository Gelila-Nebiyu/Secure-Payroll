"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2, Shield, Smartphone, Copy, Check } from "lucide-react"
import Image from "next/image"

interface TOTPSetupProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function TOTPSetup({ onSuccess, onCancel }: TOTPSetupProps) {
  const [step, setStep] = useState<"start" | "scan" | "verify">("start")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [manualKey, setManualKey] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [copied, setCopied] = useState(false)

  const startEnrollment = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/totp/enroll", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setQrCode(data.qrCode)
      setManualKey(data.manualEntryKey)
      setStep("scan")
    } catch {
      setError("Failed to start enrollment")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        setVerificationCode("")
        return
      }

      onSuccess?.()
    } catch {
      setError("Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const copyManualKey = () => {
    navigator.clipboard.writeText(manualKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === "start") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account using an authenticator app</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">What you&apos;ll need</h4>
                <p className="text-sm text-muted-foreground">
                  An authenticator app like Google Authenticator, Authy, or Microsoft Authenticator
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={startEnrollment} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "scan") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>Open your authenticator app and scan this QR code</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div className="rounded-lg border bg-white p-4">
              {qrCode && <Image src={qrCode || "/placeholder.svg"} alt="TOTP QR Code" width={200} height={200} />}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">Can&apos;t scan? Enter this code manually:</div>

          <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
            <code className="flex-1 break-all text-sm">{manualKey}</code>
            <Button variant="ghost" size="sm" onClick={copyManualKey}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Button onClick={() => setStep("verify")} className="w-full">
            I&apos;ve scanned the code
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Verify Setup</CardTitle>
        <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep("scan")} className="flex-1">
            Back
          </Button>
          <Button onClick={verifyCode} disabled={isLoading || verificationCode.length !== 6} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
