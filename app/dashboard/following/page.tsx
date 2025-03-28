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
  name: string | null;
  email: string | null;
  image: string | null;
  // Add other properties your user object has
}

export default function MyFollowingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Update the state initialization
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // This function will be called after a successful unfollow action
  const handleUnfollowed = (userId: string) => {
    // Remove the unfollowed user from the list
    setFollowing(prev => prev.filter(user => user.id !== userId));
  };
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/following');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/user/following`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          const followingArray = Array.isArray(data) ? data : [];
          setFollowing(followingArray);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching following:', error);
          setError('Failed to load following. Please try again later.');
          setFollowing([]);
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
      
      <h1 className="text-2xl font-bold mb-8">People You Follow</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : following.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8">
          <p className="text-gray-600">You're not following anyone yet.</p>
          <div className="mt-4">
            <Link 
              href="/dashboard/find-friends" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Find Friends to Follow
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {following.map(user => (
              <li key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <Link href={`/profile/${user.id}`} className="flex items-center flex-1">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4">
                      {user.image ? (
                        <Image 
                          src={user.image}
                          alt={user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name || 'Unnamed User'}</h3>
                      <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                    </div>
                  </Link>
                  
                  {/* Key fix: Set isFollowing to true and pass onUnfollowed callback */}
                  <FollowButton 
                    userId={user.id} 
                    isFollowing={true} 
                    onUnfollowed={() => handleUnfollowed(user.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 