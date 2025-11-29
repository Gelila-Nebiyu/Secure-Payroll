"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Shield, Clock, Code } from "lucide-react"

interface ABACPolicy {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  conditions: Record<string, unknown>
  effect: string
  priority: number
  is_active: boolean
}

interface RuBACPolicy {
  id: string
  name: string
  description?: string
  resource?: string
  action?: string
  condition: Record<string, unknown>
  effect: string
  priority: number
  is_active: boolean
  requires_preapproval: boolean
}

interface PoliciesManagerProps {
  abacPolicies: ABACPolicy[]
  rubacPolicies: RuBACPolicy[]
}

export function PoliciesManager({ abacPolicies, rubacPolicies }: PoliciesManagerProps) {
  const router = useRouter()
  const [isCreatingABAC, setIsCreatingABAC] = useState(false)
  const [isCreatingRuBAC, setIsCreatingRuBAC] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newABACPolicy, setNewABACPolicy] = useState({
    name: "",
    description: "",
    resource: "",
    action: "read",
    conditions: "",
    effect: "allow",
    priority: 0,
  })

  const [newRuBACPolicy, setNewRuBACPolicy] = useState({
    name: "",
    description: "",
    resource: "",
    action: "",
    condition: "",
    effect: "deny",
    priority: 0,
    requiresPreapproval: false,
  })

  const handleCreateABACPolicy = async () => {
    if (!newABACPolicy.name || !newABACPolicy.resource || !newABACPolicy.conditions) {
      toast.error("Name, resource, and conditions are required")
      return
    }

    let conditions
    try {
      conditions = JSON.parse(newABACPolicy.conditions)
    } catch {
      toast.error("Invalid JSON in conditions")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/policies/abac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newABACPolicy.name,
          description: newABACPolicy.description,
          resource: newABACPolicy.resource,
          action: newABACPolicy.action,
          conditions,
          effect: newABACPolicy.effect,
          priority: newABACPolicy.priority,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("ABAC policy created successfully")
      setIsCreatingABAC(false)
      setNewABACPolicy({
        name: "",
        description: "",
        resource: "",
        action: "read",
        conditions: "",
        effect: "allow",
        priority: 0,
      })
      router.refresh()
    } catch {
      toast.error("Failed to create policy")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRuBACPolicy = async () => {
    if (!newRuBACPolicy.name || !newRuBACPolicy.condition) {
      toast.error("Name and condition are required")
      return
    }

    let condition
    try {
      condition = JSON.parse(newRuBACPolicy.condition)
    } catch {
      toast.error("Invalid JSON in condition")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/policies/rubac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRuBACPolicy.name,
          description: newRuBACPolicy.description,
          resource: newRuBACPolicy.resource || null,
          action: newRuBACPolicy.action || null,
          condition,
          effect: newRuBACPolicy.effect,
          priority: newRuBACPolicy.priority,
          requiresPreapproval: newRuBACPolicy.requiresPreapproval,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Rule policy created successfully")
      setIsCreatingRuBAC(false)
      setNewRuBACPolicy({
        name: "",
        description: "",
        resource: "",
        action: "",
        condition: "",
        effect: "deny",
        priority: 0,
        requiresPreapproval: false,
      })
      router.refresh()
    } catch {
      toast.error("Failed to create policy")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="abac" className="space-y-4">
      <TabsList>
        <TabsTrigger value="abac" className="gap-2">
          <Shield className="h-4 w-4" />
          ABAC Policies
        </TabsTrigger>
        <TabsTrigger value="rubac" className="gap-2">
          <Clock className="h-4 w-4" />
          Rule Policies
        </TabsTrigger>
      </TabsList>

      <TabsContent value="abac" className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isCreatingABAC} onOpenChange={setIsCreatingABAC}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create ABAC Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create ABAC Policy</DialogTitle>
                <DialogDescription>Define attribute-based access control policy</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Policy Name</Label>
                    <Input
                      value={newABACPolicy.name}
                      onChange={(e) => setNewABACPolicy({ ...newABACPolicy, name: e.target.value })}
                      placeholder="e.g., Finance Payroll Access"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resource</Label>
                    <Input
                      value={newABACPolicy.resource}
                      onChange={(e) => setNewABACPolicy({ ...newABACPolicy, resource: e.target.value })}
                      placeholder="e.g., payroll"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <Select
                      value={newABACPolicy.action}
                      onValueChange={(v) => setNewABACPolicy({ ...newABACPolicy, action: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="approve">Approve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Effect</Label>
                    <Select
                      value={newABACPolicy.effect}
                      onValueChange={(v) => setNewABACPolicy({ ...newABACPolicy, effect: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      value={newABACPolicy.priority}
                      onChange={(e) =>
                        setNewABACPolicy({ ...newABACPolicy, priority: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newABACPolicy.description}
                    onChange={(e) => setNewABACPolicy({ ...newABACPolicy, description: e.target.value })}
                    placeholder="Describe the policy purpose"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conditions (JSON)</Label>
                  <Textarea
                    value={newABACPolicy.conditions}
                    onChange={(e) => setNewABACPolicy({ ...newABACPolicy, conditions: e.target.value })}
                    placeholder='{"all": [{"attr": "department", "op": "eq", "value": "Finance"}]}'
                    className="font-mono text-sm"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use: attr (department, role, hour, etc.), op (eq, neq, in, between, gt, lt)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingABAC(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateABACPolicy} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Policy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {abacPolicies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={policy.effect === "allow" ? "default" : "destructive"}>{policy.effect}</Badge>
                    <Badge variant={policy.is_active ? "outline" : "secondary"}>
                      {policy.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                {policy.description && <CardDescription>{policy.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">Resource:</span>
                    <code className="rounded bg-muted px-1">{policy.resource}</code>
                    <span className="text-muted-foreground">Action:</span>
                    <code className="rounded bg-muted px-1">{policy.action}</code>
                    <span className="text-muted-foreground">Priority:</span>
                    <code className="rounded bg-muted px-1">{policy.priority}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <code className="flex-1 rounded bg-muted p-2 text-xs">
                      {JSON.stringify(policy.conditions, null, 2)}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rubac" className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isCreatingRuBAC} onOpenChange={setIsCreatingRuBAC}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Rule Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Rule Policy</DialogTitle>
                <DialogDescription>
                  Define rule-based access control (time, location, device restrictions)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Policy Name</Label>
                  <Input
                    value={newRuBACPolicy.name}
                    onChange={(e) => setNewRuBACPolicy({ ...newRuBACPolicy, name: e.target.value })}
                    placeholder="e.g., After Hours Access Restriction"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Resource (optional)</Label>
                    <Input
                      value={newRuBACPolicy.resource}
                      onChange={(e) => setNewRuBACPolicy({ ...newRuBACPolicy, resource: e.target.value })}
                      placeholder="Leave empty for all resources"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Action (optional)</Label>
                    <Input
                      value={newRuBACPolicy.action}
                      onChange={(e) => setNewRuBACPolicy({ ...newRuBACPolicy, action: e.target.value })}
                      placeholder="Leave empty for all actions"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Effect</Label>
                    <Select
                      value={newRuBACPolicy.effect}
                      onValueChange={(v) => setNewRuBACPolicy({ ...newRuBACPolicy, effect: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      value={newRuBACPolicy.priority}
                      onChange={(e) =>
                        setNewRuBACPolicy({ ...newRuBACPolicy, priority: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newRuBACPolicy.description}
                    onChange={(e) => setNewRuBACPolicy({ ...newRuBACPolicy, description: e.target.value })}
                    placeholder="Describe the rule"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Condition (JSON)</Label>
                  <Textarea
                    value={newRuBACPolicy.condition}
                    onChange={(e) => setNewRuBACPolicy({ ...newRuBACPolicy, condition: e.target.value })}
                    placeholder='{"time": {"after": "18:00", "before": "09:00"}}'
                    className="font-mono text-sm"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: time (after/before), all (array of attribute conditions)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newRuBACPolicy.requiresPreapproval}
                    onCheckedChange={(v) => setNewRuBACPolicy({ ...newRuBACPolicy, requiresPreapproval: v })}
                  />
                  <Label>Requires Pre-approval (users can request exception)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingRuBAC(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRuBACPolicy} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Policy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {rubacPolicies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={policy.effect === "allow" ? "default" : "destructive"}>{policy.effect}</Badge>
                    {policy.requires_preapproval && <Badge variant="outline">Pre-approval Available</Badge>}
                    <Badge variant={policy.is_active ? "outline" : "secondary"}>
                      {policy.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                {policy.description && <CardDescription>{policy.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">Resource:</span>
                    <code className="rounded bg-muted px-1">{policy.resource || "All"}</code>
                    <span className="text-muted-foreground">Action:</span>
                    <code className="rounded bg-muted px-1">{policy.action || "All"}</code>
                    <span className="text-muted-foreground">Priority:</span>
                    <code className="rounded bg-muted px-1">{policy.priority}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <code className="flex-1 rounded bg-muted p-2 text-xs">
                      {JSON.stringify(policy.condition, null, 2)}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
