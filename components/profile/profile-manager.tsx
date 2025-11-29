"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Fingerprint, Smartphone, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

interface UserProfile {
  id: string
  username: string
  email: string
  phone: string | null
  department: string | null
  security_label: string
  mfa_enabled: boolean
  webauthn_enabled: boolean
  created_at: string
  roles: { id: string; name: string }[]
}

export function ProfileManager() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  // TOTP enrollment state
  const [totpEnrolling, setTotpEnrolling] = useState(false)
  const [totpQR, setTotpQR] = useState<string | null>(null)
  const [totpCode, setTotpCode] = useState("")

  // WebAuthn state
  const [webauthnRegistering, setWebauthnRegistering] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile")
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully" })
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
      } else {
        setMessage({ type: "error", text: data.error || "Failed to change password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const enrollTOTP = async () => {
    setTotpEnrolling(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/totp/enroll", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setTotpQR(data.qrCode)
      } else {
        setMessage({ type: "error", text: data.error || "Failed to start TOTP enrollment" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setTotpEnrolling(false)
    }
  }

  const verifyTOTP = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: "success", text: "TOTP enabled successfully" })
        setTotpQR(null)
        setTotpCode("")
        fetchProfile()
      } else {
        setMessage({ type: "error", text: data.error || "Invalid code" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const disableTOTP = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/totp/disable", { method: "POST" })
      if (res.ok) {
        setMessage({ type: "success", text: "TOTP disabled" })
        fetchProfile()
      } else {
        setMessage({ type: "error", text: "Failed to disable TOTP" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const registerWebAuthn = async () => {
    setWebauthnRegistering(true)
    setMessage(null)
    try {
      // Get registration options from server
      const optionsRes = await fetch("/api/auth/webauthn/register", { method: "POST" })
      const optionsData = await optionsRes.json()

      if (!optionsRes.ok) {
        throw new Error(optionsData.error || "Failed to get registration options")
      }

      // Import WebAuthn browser library dynamically
      const { startRegistration } = await import("@simplewebauthn/browser")

      // Start WebAuthn registration
      const credential = await startRegistration({ optionsJSON: optionsData.options })

      // Verify with server
      const verifyRes = await fetch("/api/auth/webauthn/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      })

      if (verifyRes.ok) {
        setMessage({ type: "success", text: "Passkey registered successfully" })
        fetchProfile()
      } else {
        const verifyData = await verifyRes.json()
        throw new Error(verifyData.error || "Failed to verify credential")
      }
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        setMessage({ type: "error", text: "WebAuthn registration was cancelled" })
      } else {
        setMessage({ type: "error", text: error instanceof Error ? error.message : "An error occurred" })
      }
    } finally {
      setWebauthnRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and assigned roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={profile?.username || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={profile?.phone || "Not set"} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={profile?.department || "Not assigned"} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Clearance (MAC)</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="capitalize">
                    {profile?.security_label || "public"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assigned Roles (RBAC)</Label>
                <div className="flex flex-wrap gap-2">
                  {profile?.roles && profile.roles.length > 0 ? (
                    profile.roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Account created: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password regularly for better security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 12 characters with uppercase, lowercase, number, and symbol
                </p>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                />
              </div>
              <Button onClick={changePassword} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Authenticator App (TOTP)
              </CardTitle>
              <CardDescription>Use an authenticator app like Google Authenticator or Authy</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.mfa_enabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>TOTP is enabled</span>
                  </div>
                  <Button variant="destructive" onClick={disableTOTP} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Disable TOTP
                  </Button>
                </div>
              ) : totpQR ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app:</p>
                  <div className="flex justify-center">
                    <img src={totpQR || "/placeholder.svg"} alt="TOTP QR Code" className="rounded-lg border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Enter the 6-digit code from your app</Label>
                    <div className="flex gap-2">
                      <Input
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="max-w-32 font-mono text-center"
                      />
                      <Button onClick={verifyTOTP} disabled={saving || totpCode.length !== 6}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setTotpQR(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={enrollTOTP} disabled={totpEnrolling}>
                  {totpEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Key className="mr-2 h-4 w-4" />
                  Enable TOTP
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Passkeys (WebAuthn)
              </CardTitle>
              <CardDescription>
                Use biometrics or hardware security keys for passwordless authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.webauthn_enabled ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Passkey is registered</span>
                </div>
              ) : (
                <Button onClick={registerWebAuthn} disabled={webauthnRegistering}>
                  {webauthnRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Register Passkey
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
