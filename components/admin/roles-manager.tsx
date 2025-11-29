"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import { Plus, Shield, Trash2 } from "lucide-react"

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

interface Role {
  id: string
  name: string
  description?: string
  is_system_role: boolean
  role_permissions?: { permissions: Permission }[]
}

interface RolesManagerProps {
  roles: Role[]
  permissions: Permission[]
}

export function RolesManager({ roles, permissions }: RolesManagerProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", description: "" })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // Group permissions by resource
  const groupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = []
      }
      acc[perm.resource].push(perm)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast.error("Role name is required")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRole.name,
          description: newRole.description,
          permissionIds: selectedPermissions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Role created successfully")
      setIsCreating(false)
      setNewRole({ name: "", description: "" })
      setSelectedPermissions([])
      router.refresh()
    } catch {
      toast.error("Failed to create role")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Role deleted successfully")
      router.refresh()
    } catch {
      toast.error("Failed to delete role")
    }
  }

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) => (prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Define a new role with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., Department Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role responsibilities..."
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="max-h-64 overflow-y-auto rounded-lg border p-4">
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(groupedPermissions).map(([resource, perms]) => (
                      <AccordionItem key={resource} value={resource}>
                        <AccordionTrigger className="capitalize">{resource.replace(/_/g, " ")}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {perms.map((perm) => (
                              <div key={perm.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={perm.id}
                                  checked={selectedPermissions.includes(perm.id)}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                />
                                <Label htmlFor={perm.id} className="text-sm font-normal">
                                  {perm.action} - {perm.description || perm.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                {role.is_system_role ? (
                  <Badge variant="secondary">System</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {role.description && <CardDescription>{role.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {role.role_permissions?.map((rp) => (
                    <Badge key={rp.permissions.id} variant="outline" className="text-xs">
                      {rp.permissions.resource}.{rp.permissions.action}
                    </Badge>
                  ))}
                  {(!role.role_permissions || role.role_permissions.length === 0) && (
                    <span className="text-sm text-muted-foreground">No permissions</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
