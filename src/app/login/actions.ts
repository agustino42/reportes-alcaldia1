"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginAction(prevState: any, formData: FormData) {
    const user = formData.get('username') as string
    const pass = formData.get('password') as string

    // Validar credenciales quemadas para el prototipo
    if (user === 'admin' && pass === 'alcaldia123') {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 día
        });
        redirect('/admin')
    }

    return { error: 'Usuario o contraseña incorrectos. Tip: usa admin / alcaldia123' }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/')
}
