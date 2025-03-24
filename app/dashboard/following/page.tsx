"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/app/components/FollowButton";

// Add the appropriate interface
interface Following {
  id: string;
  name: string;
  email: string;
  image?: string;
  // Add other properties your user object has
}

export default function MyFollowingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Update the state initialization
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/following');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/user/following`)
        .then(res => res.json())
        .then(data => {
          setFollowing(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching following:', error);
          setLoading(false);
        });
    }
  }, [status, session, router]);
  
  if (status === 'loading' || loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-6 py-14">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Your Following</h1>
      
      {following.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8">
          <p className="text-gray-600">You don't follow anyone yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {following.map(follower => (
              <li key={follower.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4">
                      {follower.image ? (
                        <Image 
                          src={follower.image}
                          alt={follower.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold">
                          {follower.name ? follower.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{follower.name}</h3>
                      <p className="text-sm text-gray-500">{follower.email}</p>
                    </div>
                  </div>
                  <FollowButton userId={follower.id} isFollowing={false} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 