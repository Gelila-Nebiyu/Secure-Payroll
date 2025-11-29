import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PoliciesManager } from "@/components/admin/policies-manager"

export default async function AdminPoliciesPage() {
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

  // Get ABAC policies
  const { data: abacPolicies } = await supabase
    .from("abac_policies")
    .select("*")
    .order("priority", { ascending: false })

  // Get RuBAC policies
  const { data: rubacPolicies } = await supabase
    .from("rule_policies")
    .select("*")
    .order("priority", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Access Policies</h1>
        <p className="mt-1 text-muted-foreground">Manage ABAC and Rule-based access control policies</p>
      </div>

      <PoliciesManager abacPolicies={abacPolicies || []} rubacPolicies={rubacPolicies || []} />
    </div>
  )
}
