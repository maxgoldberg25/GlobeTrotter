"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If authentication has completed loading
    if (status !== "loading") {
      // If not authenticated, redirect to login
      if (!session) {
        router.push("/login");
      } else {
        // Redirect to dashboard if authenticated - this is the key change
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  // Show loading spinner while redirecting
  return <LoadingSpinner />;
} 