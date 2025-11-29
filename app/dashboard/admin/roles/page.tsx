import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RolesManager } from "@/components/admin/roles-manager"

export default async function AdminRolesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has admin access
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      user_roles (
        roles (name)
      )
    `)
    .eq("id", user.id)
    .single()

  const userRoles = profile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || []

  if (!userRoles.includes("System Administrator")) {
    redirect("/dashboard")
  }

  // Get all roles with permissions
  const { data: roles } = await supabase
    .from("roles")
    .select(`
      *,
      role_permissions (
        permissions (*)
      )
    `)
    .order("name")

  // Get all permissions
  const { data: permissions } = await supabase.from("permissions").select("*").order("resource").order("action")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
        <p className="mt-1 text-muted-foreground">Create and manage roles with specific permissions (RBAC)</p>
      </div>

      <RolesManager roles={roles || []} permissions={permissions || []} />
    </div>
  )
}
