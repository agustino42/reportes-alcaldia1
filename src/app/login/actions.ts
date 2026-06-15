"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['admin', 'technician']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('username') as string
    const pass = formData.get('password') as string

    // Try Supabase Auth first (redirect never inside try/catch)
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
        })

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            const role = user?.user_metadata?.role as string | undefined

            if (role && ADMIN_ROLES.includes(role)) {
                const cookieStore = await cookies()
                cookieStore.set('admin_session', 'authenticated', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24,
                })
                redirect('/admin')
            }

            // User authenticated but not admin — sign out and reject
            await supabase.auth.signOut()
            return { error: 'Acceso restringido. Solo personal autorizado de la Alcaldía.' }
        }
    } catch {
        // Supabase not available, fall through
    }

    // Fallback: hardcoded credentials for prototype
    if (email === 'admin' && pass === 'alcaldia123') {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24
        });
        redirect('/admin')
    }

    return { error: 'Credenciales incorrectas.' }
}

export async function logoutAction() {
    try {
        const supabase = await createClient()
        await supabase.auth.signOut()
    } catch {
        // ignore
    }

    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/')
}
