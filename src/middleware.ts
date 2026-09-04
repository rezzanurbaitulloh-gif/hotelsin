import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { canAccessAdminRoute, isAdministrationRoute } from '@/lib/rbac'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isAdmin = path.startsWith('/admin')
  const isAuth = path === '/login' || path === '/register'
  const isAccount = path.startsWith('/account')

  // Fetch role if logged in — public.users with fallback to auth metadata (RLS-safe)
  let role: string | null = null
  if (user?.email) {
    const { data: pubUser } = await supabase.from('users').select('role').eq('email', user.email).single()
    role = (pubUser?.role as string) ?? (user.user_metadata as any)?.role ?? (user.app_metadata as any)?.role ?? null
  }

  // Admin guard — hanya CORE ROLE (admin) boleh masuk
  if (isAdmin) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }
    // Jika tidak punya role di public.users → dianggap GUEST, block total
    if (!role || !canAccessAdminRoute(role as any, path)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      // tambahkan flag biar UI bisa kasih toast (opsional)
      url.searchParams.set('error', 'admin_only')
      return NextResponse.redirect(url)
    }
    if (isAdministrationRoute(path) && role !== 'SUPER_ADMIN' && role !== 'HOTEL_ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  // Account guard
  if (isAccount && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // If logged in and trying to access login, redirect to account
  if (isAuth && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/account/profile'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login', '/register'],
}
