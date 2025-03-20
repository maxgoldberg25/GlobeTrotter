'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'An error occurred during authentication';

  const errorMessages: Record<string, string> = {
    'OAuthSignin': 'Error starting the OAuth signin process.',
    'OAuthCallback': 'Error processing the OAuth callback.',
    'OAuthCreateAccount': 'Error creating user from OAuth provider.',
    'EmailCreateAccount': 'Error creating user with email and password.',
    'Callback': 'Error during callback processing.',
    'OAuthAccountNotLinked': 'This email is already associated with another account.',
    'EmailSignin': 'Error sending the email signin link.',
    'CredentialsSignin': 'Invalid credentials. Please check your email and password.',
    'SessionRequired': 'You must be signed in to access this page.',
    'Default': 'An unexpected error occurred.'
  };

  const errorMessage = errorMessages[error] || errorMessages['Default'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md text-left">
            <p>{errorMessage}</p>
            <p className="mt-4 text-sm">{error !== errorMessage ? `Error code: ${error}` : ''}</p>
          </div>
          <div className="mt-8 flex flex-col space-y-4">
            <Link href="/auth/signin">
              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Try signing in again
              </button>
            </Link>
            <Link href="/">
              <button className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Return to home page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 