import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register']
  
  // API routes
  const apiRoutes = ['/api/']
  
  // Static files
  const staticRoutes = ['/_next', '/images', '/favicon.ico']

  // Check if the path is public, API, or static
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route))

  // If it's a public, API, or static route, continue
  if (isPublicRoute || isApiRoute || isStaticRoute) {
    return NextResponse.next()
  }

  // For protected routes, check for auth token
  const token = request.cookies.get('access_token')?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
