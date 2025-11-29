"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { MoreHorizontal, Search, Shield, UserCog, Unlock } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  status: string
  security_label: string
  departments?: { id: string; name: string }
  user_roles?: { roles: { id: string; name: string } }[]
  created_at: string
  totp_enabled: boolean
  locked_until?: string
}

interface Role {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
}

interface UsersTableProps {
  users: User[]
  roles: Role[]
  departments: Department[]
  currentUserRoles: string[]
}

export function UsersTable({ users, roles, departments, currentUserRoles }: UsersTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogType, setDialogType] = useState<"role" | "label" | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedLabel, setSelectedLabel] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isSystemAdmin = currentUserRoles.includes("System Administrator")

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    locked: "bg-gray-100 text-gray-800",
  }

  const labelColors: Record<string, string> = {
    public: "bg-green-100 text-green-800",
    internal: "bg-yellow-100 text-yellow-800",
    confidential: "bg-red-100 text-red-800",
  }

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/roles/${selectedRole}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Role assigned successfully")
      router.refresh()
      setDialogType(null)
    } catch {
      toast.error("Failed to assign role")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSecurityLabel = async () => {
    if (!selectedUser || !selectedLabel) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/security-label`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityLabel: selectedLabel }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Security label updated successfully")
      router.refresh()
      setDialogType(null)
    } catch {
      toast.error("Failed to update security label")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlockAccount = async (userId: string) => {
    try {
      const response = await fetch("/api/auth/lockout/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Account unlocked successfully")
      router.refresh()
    } catch {
      toast.error("Failed to unlock account")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Security Label</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MFA</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{user.departments?.name || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.user_roles?.map((ur) => (
                      <Badge key={ur.roles.id} variant="outline" className="text-xs">
                        {ur.roles.name}
                      </Badge>
                    ))}
                    {(!user.user_roles || user.user_roles.length === 0) && (
                      <span className="text-sm text-muted-foreground">No roles</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={labelColors[user.security_label]}>{user.security_label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[user.status]}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  {user.totp_enabled ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500">
                      Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setSelectedRole("")
                          setDialogType("role")
                        }}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Assign Role
                      </DropdownMenuItem>
                      {isSystemAdmin && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setSelectedLabel(user.security_label)
                            setDialogType("label")
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Change Security Label
                        </DropdownMenuItem>
                      )}
                      {user.locked_until && new Date(user.locked_until) > new Date() && (
                        <DropdownMenuItem onClick={() => handleUnlockAccount(user.id)}>
                          <Unlock className="mr-2 h-4 w-4" />
                          Unlock Account
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Assign Role Dialog */}
      <Dialog open={dialogType === "role"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>Assign a role to {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={isLoading || !selectedRole}>
              {isLoading ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Security Label Dialog */}
      <Dialog open={dialogType === "label"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Security Label</DialogTitle>
            <DialogDescription>Update the MAC security clearance level for {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Security Label</Label>
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This determines what data sensitivity levels the user can access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSecurityLabel} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Label"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
