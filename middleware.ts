// ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CODE OWNER APPROVAL
// Route protection middleware for authentication
// This file protects dashboard routes and API endpoints from unauthorized access
// 
// IMPORTANT: This middleware:
// - Protects /dashboard/* routes
// - Protects /api/stripe/* routes
// - Handles session validation
// - Manages cookie-based authentication
// 
// DO NOT modify the route matching logic or session handling
// Changes can expose protected routes or block legitimate access
// 
// If you need to modify this file:
// 1. Contact the code owner first
// 2. Test all protected routes
// 3. Verify session handling
// 4. Test authentication redirects
// 5. Update the AUTHENTICATION_FLOW.md documentation

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get the current user session
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/api/stripe']
  const authRoutes = ['/login', '/register']
  const { pathname } = request.nextUrl

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to access this resource' },
        { status: 401 }
      )
    }
    // For dashboard routes, redirect to login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Refresh the session if user is authenticated
  if (user) {
    await supabase.auth.getSession()
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}