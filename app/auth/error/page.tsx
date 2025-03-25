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
    <PageContainer className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {errorMessage || "An error occurred during authentication."}
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center transition-colors"
          >
            Try Again
          </Link>
          <Link 
            href="/" 
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-center transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300">Contact Support</Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 