export const dynamic = 'force-dynamic';

"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define your types
interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  _count: {
    photos: number;
    followers: number;
    following: number;
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Link href="/api/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Sign In
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Dashboard</h1>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Profile Overview Section */}
      <div className="bg-gray-800 rounded-lg shadow p-8 mb-8">
        <div className="flex items-center mb-4">
          {userProfile?.image ? (
            <Image
              src={userProfile.image}
              alt={userProfile.name || 'User'}
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-700 rounded-full mr-4 flex items-center justify-center">
              <span className="text-2xl text-gray-300">{userProfile?.name?.charAt(0) || 'U'}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2 text-white">
              Welcome, {userProfile?.name || 'User'}
            </h1>
            <p className="text-gray-400">{userProfile?.email}</p>
            {userProfile?.bio && <p className="text-gray-500 mt-1">{userProfile.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-gray-700 rounded-lg p-4 mb-4">
          <Link href="/photos" className="text-center hover:bg-gray-600 p-3 rounded-lg transition">
            <span className="block text-3xl font-bold text-blue-400">
              {userProfile?._count?.photos || 0}
            </span>
            <span className="text-gray-300">Photos</span>
          </Link>
          
          <Link href={`/dashboard/followers`} className="text-center hover:bg-gray-600 p-3 rounded-lg transition">
            <span className="block text-3xl font-bold text-blue-400">
              {userProfile?._count?.followers || 0}
            </span>
            <span className="text-gray-300">Followers</span>
          </Link>
          
          <Link href={`/dashboard/following`} className="text-center hover:bg-gray-600 p-3 rounded-lg transition">
            <span className="block text-3xl font-bold text-blue-400">
              {userProfile?._count?.following || 0}
            </span>
            <span className="text-gray-300">Following</span>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/photos/upload" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Upload Photo
          </Link>
          <Link href="/profile/edit" className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Find Friends Section */}
        <div className="bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Find Friends
          </h2>
          <p className="text-gray-400 mb-4">Connect with other travelers and discover new places through their journeys.</p>
          <div className="flex flex-col space-y-3">
            <Link href="/explore/users" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Discover New People
            </Link>
            <Link href="/explore/nearby" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Find Travelers Nearby
            </Link>
            <Link href="/explore/suggestions" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Suggested Connections
            </Link>
          </div>
        </div>

        {/* Profile Management Section */}
        <div className="bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Manage Your Profile
          </h2>
          <p className="text-gray-400 mb-4">Customize your profile and settings to enhance your GlobeTrotter experience.</p>
          <div className="flex flex-col space-y-3">
            <Link href="/profile/edit" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile Information
            </Link>
            <Link href="/settings/privacy" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Privacy Settings
            </Link>
            <Link href="/settings/account" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Account Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Explore Map Section */}
      <div className="bg-gray-800 rounded-lg shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
          </svg>
          Explore Travel Photos
        </h2>
        <p className="text-gray-400 mb-4">Discover amazing destinations through photos shared by our community.</p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Link href="/map" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Explore World Map
          </Link>
          <Link href="/photos/trending" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Trending Locations
          </Link>
          <Link href="/photos/favorites" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            My Favorite Places
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-gray-800 rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Recent Activity
        </h2>
        <div className="p-4 text-center bg-gray-700 rounded-lg">
          <p className="text-gray-400">Your recent activity will appear here.</p>
          <Link href="/photos" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            Start by exploring photos
          </Link>
        </div>
      </div>
    </div>
  );
} 