'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Redirect if not authenticated at all
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <div className="mt-4 text-center">
            <div className="rounded-full h-24 w-24 flex items-center justify-center bg-red-100 mx-auto">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <p className="mt-6 text-center text-lg text-gray-600">
            You don't have permission to access this page. 
          </p>
          <p className="mt-2 text-center text-md text-gray-500">
            This area is restricted to administrators only.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 