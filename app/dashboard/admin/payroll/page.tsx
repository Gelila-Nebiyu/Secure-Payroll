import { PayrollAdminManager } from "@/components/admin/payroll-admin-manager"

export default function PayrollAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Administration</h1>
        <p className="text-muted-foreground">Manage all employee payroll records (requires elevated privileges)</p>
      </div>
      <PayrollAdminManager />
    </div>
  )
}
