import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
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
  const hasAccess = userRoles.some((role: string) => ["System Administrator", "HR Manager"].includes(role))

  if (!hasAccess) {
    redirect("/dashboard")
  }

  // Get all users with their roles and departments
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      departments (id, name),
      user_roles (
        roles (id, name)
      )
    `)
    .order("created_at", { ascending: false })

  // Get all roles for the role assignment dropdown
  const { data: roles } = await supabase.from("roles").select("*").order("name")

  // Get all departments
  const { data: departments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-muted-foreground">Manage users, roles, and security labels</p>
      </div>

      <UsersTable
        users={users || []}
        roles={roles || []}
        departments={departments || []}
        currentUserRoles={userRoles}
      />
    </div>
  )
}
