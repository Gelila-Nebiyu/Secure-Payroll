"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Users, TrendingUp, AlertTriangle, Loader2, CheckCircle } from "lucide-react"

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name: string
  salary_amount: number
  currency: string
  pay_period_start: string
  pay_period_end: string
  tax_info: Record<string, number>
  deductions: number
  net_pay: number
  status: string
  security_label: string
  created_at: string
}

interface PayrollStats {
  totalPayroll: number
  employeeCount: number
  pendingApprovals: number
  averageSalary: number
}

export function PayrollAdminManager() {
  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [stats, setStats] = useState<PayrollStats>({
    totalPayroll: 0,
    employeeCount: 0,
    pendingApprovals: 0,
    averageSalary: 0,
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/payroll")
      if (res.status === 403) {
        setError("Access denied. You don't have permission to view payroll records.")
        return
      }
      if (!res.ok) throw new Error("Failed to fetch records")

      const data = await res.json()
      setRecords(data.records || [])

      // Calculate stats
      const total = data.records?.reduce((sum: number, r: PayrollRecord) => sum + r.salary_amount, 0) || 0
      const pending = data.records?.filter((r: PayrollRecord) => r.status === "pending").length || 0
      setStats({
        totalPayroll: total,
        employeeCount: data.records?.length || 0,
        pendingApprovals: pending,
        averageSalary: data.records?.length ? total / data.records.length : 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/payroll/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchRecords()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update status")
      }
    } catch (err) {
      setError("Failed to update record")
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-500/10 text-green-500">Processed</Badge>
      case "approved":
        return <Badge className="bg-blue-500/10 text-blue-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLabelBadge = (label: string) => {
    switch (label) {
      case "confidential":
        return <Badge className="bg-red-500/10 text-red-500">Confidential</Badge>
      case "internal":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Internal</Badge>
      default:
        return <Badge className="bg-green-500/10 text-green-500">Public</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalPayroll)}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeeCount}</div>
            <p className="text-xs text-muted-foreground">Active records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.averageSalary)}
            </div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payroll Records</CardTitle>
          <CardDescription>Manage and approve employee payroll across the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employee_name || record.employee_id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(record.pay_period_start).toLocaleDateString()} -{" "}
                    {new Date(record.pay_period_end).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: record.currency }).format(
                      record.salary_amount,
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-green-600">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: record.currency }).format(
                      record.net_pay,
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{getLabelBadge(record.security_label)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(record.id, "pending")}
                          disabled={processing}
                        >
                          Submit
                        </Button>
                      )}
                      {record.status === "pending" && (
                        <Button size="sm" onClick={() => updateStatus(record.id, "approved")} disabled={processing}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {record.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(record.id, "processed")}
                          disabled={processing}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
