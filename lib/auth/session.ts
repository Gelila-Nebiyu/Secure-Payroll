import { createClient } from "@/lib/supabase/server"

export interface CurrentUser {
  id: string
  email: string
  roles: string[]
  securityLabel?: string
  department?: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user's profile with roles from user_roles join table
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      security_label,
      department_id,
      departments (name),
      user_roles (
        roles (name)
      )
    `)
    .eq("id", user.id)
    .single()

  const roles = profile?.user_roles?.map((ur: { roles: { name: string } }) => ur.roles.name) || []

  return {
    id: user.id,
    email: user.email!,
    roles,
    securityLabel: profile?.security_label,
    department: (profile?.departments as { name: string } | null)?.name,
  }
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function createSession(userId: string): Promise<void> {
  const supabase = await createClient()

  // Update last login timestamp
  await supabase
    .from("profiles")
    .update({
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}
