import { createClient } from "@/lib/supabase/server"
import { SettingsManager } from "@/components/settings/settings-manager"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and notifications</p>
      </div>
      <SettingsManager
        userId={user?.id || ""}
        initialSettings={{
          notifications_email: profile?.notifications_email ?? true,
          notifications_push: profile?.notifications_push ?? true,
          notifications_sms: profile?.notifications_sms ?? false,
          theme: profile?.theme || "system",
          language: profile?.language || "en",
          timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        }}
      />
    </div>
  )
}
