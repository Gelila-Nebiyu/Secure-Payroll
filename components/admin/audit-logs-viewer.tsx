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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Download, Eye, Shield, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface AuditLog {
  id: string
  user_id: string
  username: string
  action: string
  resource_type: string
  resource_id: string
  ip_address: string
  user_agent: string
  result: string
  metadata: Record<string, unknown>
  created_at: string
}

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: "",
    resource_type: "",
    result: "",
    user_id: "",
    start_date: "",
    end_date: "",
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const res = await fetch(`/api/audit/logs?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append("export", "true")

      const res = await fetch(`/api/audit/logs?${params}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs-${new Date().toISOString()}.json`
        a.click()
      }
    } catch (error) {
      console.error("Failed to export logs:", error)
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) return <Shield className="h-4 w-4" />
    if (action.includes("denied") || action.includes("failed")) return <AlertTriangle className="h-4 w-4" />
    if (action.includes("created") || action.includes("approved")) return <CheckCircle className="h-4 w-4" />
    return <Info className="h-4 w-4" />
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "success":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Success</Badge>
      case "denied":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Denied</Badge>
      case "failed":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Failed</Badge>
      default:
        return <Badge variant="secondary">{result}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
          <CardDescription>Search and filter audit trail entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={filters.action} onValueChange={(v) => setFilters({ ...filters, action: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="access_check">Access Check</SelectItem>
                  <SelectItem value="role_assigned">Role Assigned</SelectItem>
                  <SelectItem value="permission_granted">Permission Granted</SelectItem>
                  <SelectItem value="data_read">Data Read</SelectItem>
                  <SelectItem value="data_write">Data Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select value={filters.resource_type} onValueChange={(v) => setFilters({ ...filters, resource_type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Select value={filters.result} onValueChange={(v) => setFilters({ ...filters, result: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All results</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={fetchLogs} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Showing {logs.length} entries (encrypted at rest)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.username || "System"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="capitalize">{log.action.replace(/_/g, " ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{log.resource_type}</span>
                      {log.resource_id && <span className="ml-1 text-xs">#{log.resource_id.slice(0, 8)}</span>}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                    <TableCell>{getResultBadge(log.result)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>Full details for audit entry {log.id.slice(0, 8)}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">User ID</Label>
                                <p className="font-mono text-sm">{log.user_id || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Username</Label>
                                <p>{log.username || "System"}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Action</Label>
                                <p className="capitalize">{log.action.replace(/_/g, " ")}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Result</Label>
                                <p>{getResultBadge(log.result)}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Resource Type</Label>
                                <p>{log.resource_type}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Resource ID</Label>
                                <p className="font-mono text-sm">{log.resource_id || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">IP Address</Label>
                                <p className="font-mono text-sm">{log.ip_address}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Timestamp</Label>
                                <p>{new Date(log.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">User Agent</Label>
                              <p className="text-sm break-all">{log.user_agent}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Metadata (Decrypted)</Label>
                              <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-auto max-h-48">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
