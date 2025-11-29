"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Eye, Lock, DollarSign, AlertTriangle } from "lucide-react"

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name: string
  salary_amount: number
  currency: string
  pay_period_start: string
  pay_period_end: string
  tax_info: {
    federal_tax: number
    state_tax: number
    social_security: number
    medicare: number
  }
  deductions: number
  net_pay: number
  status: string
  security_label: string
  created_at: string
}

export function PayrollManager() {
  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    employee_id: "",
    salary_amount: "",
    currency: "USD",
    pay_period_start: "",
    pay_period_end: "",
    security_label: "internal",
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    setAccessDenied(false)
    try {
      const res = await fetch("/api/payroll")
      if (res.status === 403) {
        setAccessDenied(true)
        return
      }
      if (!res.ok) {
        throw new Error("Failed to fetch payroll records")
      }
      const data = await res.json()
      setRecords(data.records)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async () => {
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecord,
          salary_amount: Number.parseFloat(newRecord.salary_amount),
        }),
      })
      if (res.status === 403) {
        setError("Access denied: You don't have permission to create payroll records")
        return
      }
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create record")
      }
      setIsCreateOpen(false)
      setNewRecord({
        employee_id: "",
        salary_amount: "",
        currency: "USD",
        pay_period_start: "",
        pay_period_end: "",
        security_label: "internal",
      })
      fetchRecords()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const getLabelBadge = (label: string) => {
    switch (label) {
      case "confidential":
        return <Badge className="bg-red-500/10 text-red-500">Confidential</Badge>
      case "internal":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Internal</Badge>
      case "public":
        return <Badge className="bg-green-500/10 text-green-500">Public</Badge>
      default:
        return <Badge variant="secondary">{label}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-500/10 text-green-500">Processed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (accessDenied) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to view payroll records. This may be due to your security clearance level, role,
            department, or current access rules.
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => (window.location.href = "/dashboard/access-requests")}
          >
            Request Access
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payroll Records</CardTitle>
            <CardDescription>Manage employee compensation and payment history</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Payroll Record</DialogTitle>
                <DialogDescription>Add a new payroll entry for an employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input
                    value={newRecord.employee_id}
                    onChange={(e) => setNewRecord({ ...newRecord, employee_id: e.target.value })}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salary Amount</Label>
                    <Input
                      type="number"
                      value={newRecord.salary_amount}
                      onChange={(e) => setNewRecord({ ...newRecord, salary_amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={newRecord.currency}
                      onValueChange={(v) => setNewRecord({ ...newRecord, currency: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="ETB">ETB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pay Period Start</Label>
                    <Input
                      type="date"
                      value={newRecord.pay_period_start}
                      onChange={(e) => setNewRecord({ ...newRecord, pay_period_start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Period End</Label>
                    <Input
                      type="date"
                      value={newRecord.pay_period_end}
                      onChange={(e) => setNewRecord({ ...newRecord, pay_period_end: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Security Label (MAC)</Label>
                  <Select
                    value={newRecord.security_label}
                    onValueChange={(v) => setNewRecord({ ...newRecord, security_label: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createRecord}>Create Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payroll records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(record)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Payroll Details</DialogTitle>
                              <DialogDescription>
                                Pay period: {record.pay_period_start} to {record.pay_period_end}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRecord && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">Gross Salary</Label>
                                    <p className="font-mono text-lg">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: selectedRecord.currency,
                                      }).format(selectedRecord.salary_amount)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Net Pay</Label>
                                    <p className="font-mono text-lg text-green-600">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: selectedRecord.currency,
                                      }).format(selectedRecord.net_pay)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Tax Breakdown</Label>
                                  <div className="mt-2 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Federal Tax</span>
                                      <span className="font-mono">
                                        ${selectedRecord.tax_info?.federal_tax?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>State Tax</span>
                                      <span className="font-mono">
                                        ${selectedRecord.tax_info?.state_tax?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Social Security</span>
                                      <span className="font-mono">
                                        ${selectedRecord.tax_info?.social_security?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Medicare</span>
                                      <span className="font-mono">
                                        ${selectedRecord.tax_info?.medicare?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                      <span>Other Deductions</span>
                                      <span className="font-mono">
                                        ${selectedRecord.deductions?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
