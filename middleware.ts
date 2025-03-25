import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Middleware function to handle authentication
export async function middleware(request: NextRequest) {
  try {
    // Get the token using next-auth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;
    const path = request.nextUrl.pathname;
    
    // Define authentication required paths
    const authRequiredPaths = ['/dashboard', '/profile', '/upload', '/admin', '/settings'];
    const authPages = ['/login', '/signup'];
    
    // Check if the current path requires authentication
    const isAuthRequired = authRequiredPaths.some(authPath => path.startsWith(authPath));
    const isAuthPage = authPages.some(authPath => path.startsWith(authPath));
    const isApiRoute = path.startsWith('/api');

    // Redirect to login if auth is required but user is not authenticated
    if (isAuthRequired && !isAuthenticated && !isApiRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect to dashboard if user is authenticated but trying to access auth pages
    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, allow the request to continue
    return NextResponse.next();
  }
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 