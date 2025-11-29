import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with roles
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      departments (name),
      user_roles (
        roles (id, name)
      )
    `)
    .eq("id", user.id)
    .single()

  const userRoles = profile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || []

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader
        user={{
          id: user.id,
          email: user.email || "",
          username: profile?.username || user.email?.split("@")[0] || "User",
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          department: profile?.departments?.name,
          roles: userRoles,
          securityLabel: profile?.security_label,
        }}
      />
      <div className="flex">
        <DashboardNav userRoles={userRoles} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
