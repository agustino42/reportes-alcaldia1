import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

const ADMIN_ROLES = ['admin', 'technician']

function hasAdminRole(user: NonNullable<Awaited<ReturnType<typeof updateSession>>['user']> | null): boolean {
  if (!user) return false
  const role = user.user_metadata?.role as string | undefined
  return !!role && ADMIN_ROLES.includes(role)
}

export async function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isGestionRoute = request.nextUrl.pathname.startsWith('/gestion')
    const isLoginPage = request.nextUrl.pathname === '/login'

    try {
        const { supabaseResponse, user } = await updateSession(request)
        const legacySession = request.cookies.get('admin_session')
        const isAdminUser = hasAdminRole(user) || !!legacySession

        if (isAdminRoute || isGestionRoute) {
            if (!isAdminUser) {
                const loginUrl = new URL('/login', request.url)
                if (user && !isAdminUser) {
                    loginUrl.searchParams.set('error', 'acceso_restringido')
                }
                return NextResponse.redirect(loginUrl)
            }
        }

        if (isLoginPage) {
            if (isAdminUser) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }

        return supabaseResponse
    } catch {
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
}

export const config = {
    matcher: ['/admin/:path*', '/gestion/:path*', '/login'],
}
