import { AuditLogsViewer } from "@/components/admin/audit-logs-viewer"

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">View all system activity and security events with encrypted log storage</p>
      </div>
      <AuditLogsViewer />
    </div>
  )
}
