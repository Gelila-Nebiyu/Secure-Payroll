"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { TOTPSetup } from "@/components/auth/totp-setup"
import { toast } from "sonner"
import { Smartphone, Key, Lock } from "lucide-react"

interface SecuritySettingsProps {
  totpEnabled: boolean
  passkeysCount: number
}

export function SecuritySettings({ totpEnabled, passkeysCount }: SecuritySettingsProps) {
  const router = useRouter()
  const [showTOTPSetup, setShowTOTPSetup] = useState(false)
  const [showDisableTOTP, setShowDisableTOTP] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [disableToken, setDisableToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleDisableTOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/totp/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: disableToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        setDisableToken("")
        return
      }

      toast.success("TOTP disabled successfully")
      setShowDisableTOTP(false)
      router.refresh()
    } catch {
      toast.error("Failed to disable TOTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Password changed successfully")
      setShowPasswordChange(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { test: newPassword.length >= 12, label: "At least 12 characters" },
    { test: /[A-Z]/.test(newPassword), label: "One uppercase letter" },
    { test: /[a-z]/.test(newPassword), label: "One lowercase letter" },
    { test: /[0-9]/.test(newPassword), label: "One number" },
    { test: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword), label: "One special character" },
  ]

  return (
    <div className="space-y-6">
      {/* TOTP Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Authenticator App (TOTP)</CardTitle>
                <CardDescription>
                  Use an authenticator app for two-factor authentication
                </CardDescription>
              </div>
            </div>
            <Badge variant={totpEnabled ? "default" : "secondary"}>
              {totpEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {totpEnabled ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Your account is protected with TOTP two-factor authentication
              </p>
              <Button variant="outline" onClick={() => setShowDisableTOTP(true)}>
                Disable TOTP
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security with an authenticator app
              </p>
              <Button onClick={() => setShowTOTPSetup(true)}>
                Enable TOTP
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Passkeys / WebAuthn */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Passkeys</CardTitle>
                <CardDescription>
                  Use biometrics or security keys for passwordless login
                </CardDescription>
              </div>
            </div>
            <Badge variant={passkeysCount > 0 ? "default" : "secondary"}>
              {passkeysCount} registered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Passkeys provide phishing-resistant authentication using your device
            </p>
            <Button variant="outline">
              Add Passkey
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your account password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Use a strong, unique password with at least 12 characters
            </p>
            <Button variant="outline" onClick={() => setShowPasswordChange(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TOTP Setup Dialog */}
      <Dialog open={showTOTPSetup} onOpenChange={setShowTOTPSetup}>
        <DialogContent className="sm:max-w-md">
          <TOTPSetup
            onSuccess={() => {
              setShowTOTPSetup(false)
              router.refresh()
              toast.success("TOTP enabled successfully")
            }}
            onCancel={() => setShowTOTPSetup(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Disable TOTP Dialog */}
      <Dialog open={showDisableTOTP} onOpenChange={setShowDisableTOTP}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your current authenticator code to confirm
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={disableToken}
              onChange={setDisableToken}
            >
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
          <Alert variant="destructive">
            <AlertDescription>
              Disabling TOTP will reduce your account security. Consider keeping it enabled.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableTOTP(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisableTOTP}
              disabled={isLoading || disableToken.length !== 6}
            >
              {isLoading ? "Disabling..." : "Disable TOTP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? \
