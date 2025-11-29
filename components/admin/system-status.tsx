"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  Database,
  Shield,
  HardDrive,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Loader2,
} from "lucide-react"

interface HealthCheck {
  status: string
  timestamp: string
  checks: {
    database: { status: string; responseTime: string; error?: string }
    encryption: { status: string; message: string }
    environment: { nodeEnv: string; vercel: boolean }
  }
  version: string
}

interface Backup {
  id: string
  backup_type: string
  status: string
  file_path: string | null
  file_size_bytes: number | null
  tables_backed_up: string[]
  error_message: string | null
  started_at: string
  completed_at: string | null
}

export function SystemStatus() {
  const [health, setHealth] = useState<HealthCheck | null>(null)
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [backingUp, setBackingUp] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const [healthRes, backupsRes] = await Promise.all([fetch("/api/system/health"), fetch("/api/system/backup")])

      if (healthRes.ok) {
        setHealth(await healthRes.json())
      }
      if (backupsRes.ok) {
        const data = await backupsRes.json()
        setBackups(data.backups || [])
      }
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    } finally {
      setLoading(false)
    }
  }

  const triggerBackup = async () => {
    setBackingUp(true)
    try {
      const res = await fetch("/api/system/backup", { method: "POST" })
      if (res.ok) {
        fetchStatus()
      }
    } catch (error) {
      console.error("Backup trigger failed:", error)
    } finally {
      setBackingUp(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
      case "healthy":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warn":
      case "started":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "fail":
      case "unhealthy":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
      case "started":
        return <Badge className="bg-yellow-500/10 text-yellow-500">In Progress</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "N/A"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Health Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(health?.status || "unknown")}
              <span className="text-2xl font-bold capitalize">{health?.status || "Unknown"}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Version {health?.version || "1.0.0"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(health?.checks.database.status || "unknown")}
              <span className="text-2xl font-bold capitalize">
                {health?.checks.database.status === "pass" ? "Connected" : "Error"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Response: {health?.checks.database.responseTime || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encryption</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(health?.checks.encryption.status || "unknown")}
              <span className="text-2xl font-bold">
                {health?.checks.encryption.status === "pass" ? "Active" : "Warning"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{health?.checks.encryption.message || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      {health?.checks.encryption.status === "warn" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Warning</AlertTitle>
          <AlertDescription>
            Using default encryption key. Please set a unique ENCRYPTION_KEY environment variable in production.
          </AlertDescription>
        </Alert>
      )}

      {/* Backup Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Backup History
            </CardTitle>
            <CardDescription>Database backups and recovery points</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={triggerBackup} disabled={backingUp}>
              {backingUp ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Trigger Backup
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No backup history found</p>
              <p className="text-sm">Backups are handled by Supabase or GitHub Actions</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="capitalize">{backup.backup_type}</TableCell>
                    <TableCell>{getStatusBadge(backup.status)}</TableCell>
                    <TableCell>{formatBytes(backup.file_size_bytes)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(backup.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {backup.completed_at ? new Date(backup.completed_at).toLocaleString() : "In progress..."}
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
