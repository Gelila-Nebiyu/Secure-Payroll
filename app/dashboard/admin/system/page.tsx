import { SystemStatus } from "@/components/admin/system-status"

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground">Monitor system health, backups, and security events</p>
      </div>
      <SystemStatus />
    </div>
  )
}
