"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function OAuthButtons() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider, {
      callbackUrl: window.location.origin + '/dashboard',
      redirect: true // Use redirect: true for OAuth
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleOAuthSignIn('google')}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          {/* Google icon SVG */}
        </svg>
        Sign in with Google
      </button>
      
      {/* Add other OAuth providers as needed */}
    </div>
  );
} 