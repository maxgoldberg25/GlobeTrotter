"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageContainer from "../../components/PageContainer";

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");

  useEffect(() => {
    const error = searchParams?.get("error");
    let message = "An unexpected authentication error occurred";
    let type = error || "Unknown";

    // Map error codes to user-friendly messages
    if (error === "Signin") {
      message = "Try signing in with a different account or method.";
    } else if (error === "OAuthSignin" || error === "OAuthCallback") {
      message = "Error connecting to the OAuth provider. Please try again.";
    } else if (error === "OAuthCreateAccount") {
      message = "Unable to create an account using this OAuth provider.";
    } else if (error === "EmailCreateAccount") {
      message = "Unable to create an account using this email provider.";
    } else if (error === "Callback") {
      message = "The authentication callback failed. Please try again.";
    } else if (error === "OAuthAccountNotLinked") {
      message = "Email already used with a different provider. Please sign in using the original provider.";
    } else if (error === "EmailSignin") {
      message = "The email verification link is invalid or has expired.";
    } else if (error === "CredentialsSignin") {
      message = "Invalid username or password. Please check your credentials and try again.";
    } else if (error === "SessionRequired") {
      message = "You must be signed in to access this page.";
    } else if (error === "default") {
      message = "Unable to sign in. Please try again later.";
    }

    setErrorMessage(message);
    setErrorType(type);
  }, [searchParams]);

  const troubleshootingTips = [
    "Make sure caps lock is off",
    "Verify your email address is entered correctly",
    "If you're using the admin account, run the setup script: node scripts/setup-admin.js",
    "Try resetting your password (if available)",
    "Clear your browser cache or try a different browser"
  ];

  return (
    <PageContainer>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Authentication Error</h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{errorMessage}</p>
          <p className="text-xs text-gray-500 mt-1">Error type: {errorType}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Tips:</h2>
          <ul className="list-disc pl-5 space-y-1">
            {troubleshootingTips.map((tip, index) => (
              <li key={index} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Try Again
          </Link>
          <Link 
            href="/" 
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 