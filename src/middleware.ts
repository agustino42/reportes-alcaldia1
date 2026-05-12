import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isGestionRoute = request.nextUrl.pathname.startsWith('/gestion')
    const isLoginPage = request.nextUrl.pathname === '/login'

    if (isAdminRoute || isGestionRoute) {
        const session = request.cookies.get('admin_session')

        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (isLoginPage) {
        const session = request.cookies.get('admin_session')
        if (session) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/gestion/:path*', '/login'],
}
