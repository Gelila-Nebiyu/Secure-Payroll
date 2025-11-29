"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Check, X, Clock, FileText } from "lucide-react"

interface AccessRequest {
  id: string
  requester_id: string
  requester_name: string
  resource_type: string
  resource_id: string
  action: string
  reason: string
  status: string
  approver_id: string | null
  approver_name: string | null
  created_at: string
  resolved_at: string | null
}

export function AccessRequestsManager() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    resource_type: "",
    resource_id: "",
    action: "read",
    reason: "",
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      // Fetch my requests
      const myRes = await fetch("/api/access-request?type=my")
      if (myRes.ok) {
        const data = await myRes.json()
        setRequests(data.requests)
      }

      // Fetch pending requests (for approvers)
      const pendingRes = await fetch("/api/access-request?type=pending")
      if (pendingRes.ok) {
        const data = await pendingRes.json()
        setPendingRequests(data.requests)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const createRequest = async () => {
    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      })
      if (res.ok) {
        setIsCreateOpen(false)
        setNewRequest({ resource_type: "", resource_id: "", action: "read", reason: "" })
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to create request:", error)
    }
  }

  const handleApproval = async (requestId: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/access-request/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      })
      if (res.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to process approval:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500">Approved</Badge>
      case "denied":
        return <Badge className="bg-red-500/10 text-red-500">Denied</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Tabs defaultValue="my-requests" className="space-y-6">
      <TabsList>
        <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        <TabsTrigger value="pending-approvals">
          Pending Approvals
          {pendingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pendingRequests.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-requests">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Access Requests</CardTitle>
              <CardDescription>Track your submitted access requests</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Access</DialogTitle>
                  <DialogDescription>Submit a request to access a resource</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Resource Type</Label>
                    <Select
                      value={newRequest.resource_type}
                      onValueChange={(v) => setNewRequest({ ...newRequest, resource_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payroll">Payroll Records</SelectItem>
                        <SelectItem value="employee_data">Employee Data</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                        <SelectItem value="system_config">System Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Resource ID (optional)</Label>
                    <Input
                      value={newRequest.resource_id}
                      onChange={(e) => setNewRequest({ ...newRequest, resource_id: e.target.value })}
                      placeholder="Specific resource ID or leave empty for general access"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <Select
                      value={newRequest.action}
                      onValueChange={(v) => setNewRequest({ ...newRequest, action: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="write">Write</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="approve">Approve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason / Justification</Label>
                    <Textarea
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                      placeholder="Explain why you need this access..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createRequest}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No access requests submitted</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.resource_type}
                        {request.resource_id && (
                          <span className="text-muted-foreground ml-1">#{request.resource_id.slice(0, 8)}</span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">{request.action}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending-approvals">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and approve access requests from other users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requester_name}</TableCell>
                      <TableCell>
                        {request.resource_type}
                        {request.resource_id && (
                          <span className="text-muted-foreground ml-1">#{request.resource_id.slice(0, 8)}</span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">{request.action}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleApproval(request.id, true)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleApproval(request.id, false)}>
                            <X className="h-4 w-4" />
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
      </TabsContent>
    </Tabs>
  )
}
