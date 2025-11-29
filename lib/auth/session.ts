import { createClient } from "@/lib/supabase/server"

export interface CurrentUser {
  id: string
  email: string
  role?: string
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

  // Get user's role from profiles
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email!,
    role: profile?.role,
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
