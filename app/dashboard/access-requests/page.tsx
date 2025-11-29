import { AccessRequestsManager } from "@/components/access-requests/access-requests-manager"

export default function AccessRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Access Requests</h1>
        <p className="text-muted-foreground">Request access to resources or approve pending requests</p>
      </div>
      <AccessRequestsManager />
    </div>
  )
}
