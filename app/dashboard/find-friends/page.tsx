"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/app/components/FollowButton";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function FindFriendsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/find-friends');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/users/discover`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          const usersArray = Array.isArray(data) ? data : [];
          setUsers(usersArray);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error discovering users:', error);
          setError('Failed to load users. Please try again later.');
          setUsers([]);
          setLoading(false);
        });
    }
  }, [status, session, router]);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
      
      <h1 className="text-2xl font-bold mb-8">Find Friends</h1>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8">
          <p className="text-gray-600">
            {searchTerm 
              ? `No users found matching "${searchTerm}"`
              : "No users available to follow right now."
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
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
                  <FollowButton userId={user.id} isFollowing={false} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 