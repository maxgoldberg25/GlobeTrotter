import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/auth');
  
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  
  // If the user is on a protected route without authentication, redirect to login
  if (!isAuthenticated && 
      !isAuthPage && 
      !isApiRoute && 
      (
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/upload') ||
        request.nextUrl.pathname.startsWith('/dashboard')
      )
     ) {
    // Store the original URL in the search parameters
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and visiting auth pages, redirect to profile
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Add auth state to request headers to make it available to pages
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-is-authenticated', isAuthenticated ? 'true' : 'false');

  // Return the response with updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run middleware on matching routes
export const config = {
  matcher: [
    '/profile/:path*',
    '/upload/:path*',
    '/settings/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
}; 