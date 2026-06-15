import { createClient } from './supabase/server'

export type UserRole = 'admin' | 'technician' | 'citizen'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return (user.user_metadata?.role as UserRole) || 'citizen'
}

export async function requireRole(...roles: UserRole[]): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false
  return roles.includes(role)
}
