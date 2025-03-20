'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
      return;
    }

    if (status === 'authenticated' && session?.user?.email !== 'test@gmail.com') {
      router.push('/unauthorized');
      return;
    }

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, session, router, params.id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First check if the user exists
      const checkResponse = await fetch(`/api/admin/users/${params.id}`);
      
      if (!checkResponse.ok) {
        if (checkResponse.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await checkResponse.json();
      setUser(userData);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      ) : user ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                  <Image
                    src={user.image || '/avatar-placeholder.png'}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">{user.name || 'Unnamed User'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                    <div className="mb-2">
                      <span className="text-gray-600">Email:</span> {user.email}
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-600">Email Verified:</span>{' '}
                      <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
                        {user.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {user.emailVerified && (
                      <div className="mb-2">
                        <span className="text-gray-600">Verified On:</span> {formatDate(user.emailVerified)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dates</h3>
                    <div className="mb-2">
                      <span className="text-gray-600">Created:</span> {formatDate(user.createdAt)}
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-600">Last Updated:</span> {formatDate(user.updatedAt)}
                    </div>
                  </div>
                </div>
                
                {user.email !== 'test@gmail.com' && (
                  <div className="mt-6">
                    <button
                      onClick={() => router.push(`/admin`)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
          <p>No user data found.</p>
        </div>
      )}
    </div>
  );
} 