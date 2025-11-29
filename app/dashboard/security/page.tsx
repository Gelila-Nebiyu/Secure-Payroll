import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SecuritySettings } from "@/components/dashboard/security-settings"

export default async function SecurityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("totp_enabled, webauthn_credentials")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account security and authentication methods</p>
      </div>

      <SecuritySettings
        totpEnabled={profile?.totp_enabled || false}
        passkeysCount={(profile?.webauthn_credentials as unknown[])?.length || 0}
      />
    </div>
  )
}
