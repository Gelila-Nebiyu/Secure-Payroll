import { ProfileManager } from "@/components/profile/profile-manager"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and security preferences</p>
      </div>
      <ProfileManager />
    </div>
  )
}
