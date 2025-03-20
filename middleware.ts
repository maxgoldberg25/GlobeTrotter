import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Use a try-catch to prevent crashing due to missing environment variables
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
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
          request.nextUrl.pathname.startsWith('/dashboard') ||
          request.nextUrl.pathname.startsWith('/admin')
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
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, continue without authentication
    return NextResponse.next();
  }
}

// Only run middleware on matching routes
export const config = {
  matcher: [
    '/profile/:path*',
    '/upload/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/auth/signin',
    '/auth/signup',
    '/login',
    '/signup',
  ],
}; 