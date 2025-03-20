import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // List of paths that require authentication
  const protectedPaths = [
    '/profile',
    '/upload',
    '/settings',
  ];

  // Check if the path is in the protected list
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if accessing a protected route without authentication
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if the user is already authenticated but tries to access login/signup
  if (token && (
    request.nextUrl.pathname.startsWith('/auth/signin') || 
    request.nextUrl.pathname.startsWith('/auth/signup')
  )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
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