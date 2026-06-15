"use server"

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setUserRole(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const role = formData.get('role') as 'admin' | 'technician' | 'citizen'

    if (!email || !role) {
      return { error: 'Email y rol son requeridos.' }
    }

    if (!['admin', 'technician', 'citizen'].includes(role)) {
      return { error: 'Rol inválido.' }
    }

    // Verify the caller is an admin
    const supabase = await createClient()
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    const adminRole = adminUser?.user_metadata?.role
    if (adminRole !== 'admin') {
      return { error: 'Solo un administrador puede asignar roles.' }
    }

    // Use admin client (service_role) to update user metadata
    const adminClient = createAdminClient()

    // Find the user by email first
    const { data: users, error: listError } = await adminClient.auth.admin.listUsers()
    if (listError) return { error: listError.message }

    const targetUser = users.users.find(u => u.email === email)
    if (!targetUser) return { error: `Usuario ${email} no encontrado.` }

    const { data, error } = await adminClient.auth.admin.updateUserById(
      targetUser.id,
      { user_metadata: { ...targetUser.user_metadata, role } }
    )

    if (error) return { error: error.message }

    return { success: true, message: `Rol "${role}" asignado a ${email}` }
  } catch {
    return { error: 'Error al asignar rol. Verifica que el usuario exista en Supabase Auth.' }
  }
}
