import { PayrollManager } from "@/components/payroll/payroll-manager"

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Records</h1>
        <p className="text-muted-foreground">View and manage employee payroll information (access controlled)</p>
      </div>
      <PayrollManager />
    </div>
  )
}
