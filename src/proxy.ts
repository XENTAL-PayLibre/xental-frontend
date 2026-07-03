import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add all the routes that logged-in users should NOT be able to access
const authRoutes = ['/login', '/signup', '/verify-email', '/email-verified'];

// Add all the routes that ONLY logged-in users should be able to access
const protectedRoutes = ['/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate on a first-party session sentinel set by the frontend on login (has_refresh_token).
  // The real session (xnt_access/xnt_refresh) is HttpOnly on the API's domain, so it is not
  // visible here when the frontend + API origins differ (e.g. localhost dev → staging API).
  // Fall back to xnt_refresh for same-site setups where it is visible.
  const hasSessionCookie =
    request.cookies.has('xnt_session') || request.cookies.has('xnt_refresh');

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If the user is logged in and tries to access an Auth route (like /login), redirect to Dashboard
  if (hasSessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If NOT logged in and tries to access a Protected route, redirect to Login
  if (!hasSessionCookie && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    // Optional: save the page they tried to visit so you can redirect them back after they log in
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure the proxy only runs on relevant paths, ignoring static files and Next.js internals
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
