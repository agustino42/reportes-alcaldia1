import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/login'

    if (isAdminRoute) {
        const session = request.cookies.get('admin_session')

        // Si no está autenticado, redirigir al login
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Si trata de entrar al login pero ya está autenticado, redirigir al dash
    if (isLoginPage) {
        const session = request.cookies.get('admin_session')
        if (session) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
}
