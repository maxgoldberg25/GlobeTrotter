"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Define your types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  _count: {
    photos: number;
    followers: number;
    following: number;
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false); // Track if we've attempted to fetch

  useEffect(() => {
    // Only run this once when session is authenticated
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
      return;
    }

    // Only fetch if we haven't already attempted and we have a session
    if (status === 'authenticated' && session?.user?.id && !fetchAttempted) {
      setFetchAttempted(true); // Mark that we've attempted the fetch
      
      // Fetch user data
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setUserProfile(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setLoading(false);
        });
    }
  }, [status, session, router, fetchAttempted]); // Include fetchAttempted in dependencies

  if (status === 'loading' || loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!userProfile) {
    return <div className="container mx-auto p-4">User profile not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-14">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {userProfile?.name || 'User'}
      </h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:mr-6 mb-4 md:mb-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                {userProfile.image ? (
                  <Image
                    src={userProfile.image}
                    alt={userProfile.name || 'User'}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-blue-600 text-white text-4xl font-bold">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-600 mb-4">{userProfile.email}</p>
              
              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4 mb-4">
                <Link href="/photos" className="text-center hover:bg-gray-100 p-3 rounded-lg transition">
                  <span className="block text-3xl font-bold text-blue-600">
                    {userProfile?._count?.photos || 0}
                  </span>
                  <span className="text-gray-600">Photos</span>
                </Link>
                
                <Link href={`/dashboard/followers`} className="text-center hover:bg-gray-100 p-3 rounded-lg transition">
                  <span className="block text-3xl font-bold text-blue-600">
                    {userProfile?._count?.followers || 0}
                  </span>
                  <span className="text-gray-600">Followers</span>
                </Link>
                
                <Link href={`/dashboard/following`} className="text-center hover:bg-gray-100 p-3 rounded-lg transition">
                  <span className="block text-3xl font-bold text-blue-600">
                    {userProfile?._count?.following || 0}
                  </span>
                  <span className="text-gray-600">Following</span>
                </Link>
              </div>
              
              <div className="mt-4">
                <Link 
                  href="/dashboard/find-friends" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mr-2"
                >
                  Find Friends
                </Link>
                <Link href="/profile/edit" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Photos</h2>
          <p className="text-gray-600 mb-4">You haven't uploaded any photos yet.</p>
          <button className="btn-primary">Upload Your First Photo</button>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Explore Map</h2>
          <p className="text-gray-600 mb-4">Discover places you've been and places to go.</p>
          <Link href="/map">
            <button className="btn-secondary">View Map</button>
          </Link>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Connect</h2>
          <p className="text-gray-600 mb-4">Find friends and fellow travelers to follow.</p>
          <Link href="/dashboard/find-friends">
            <button className="btn-primary">Find Friends</button>
          </Link>
        </div>
      </div>
    </div>
  );
} 