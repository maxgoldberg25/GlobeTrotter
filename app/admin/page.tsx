"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageContainer from '../components/PageContainer';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Specific credential check
      if (status === 'authenticated' && session?.user?.email === 'test@gmail.com') {
        try {
          // For demo purposes, we'll create some mock users
          // In a real app, you would fetch from the database
          setUsers([
            {
              id: '1',
              name: 'Jane Smith',
              email: 'jane@example.com',
              image: null,
              createdAt: '2023-01-15',
            },
            {
              id: '2',
              name: 'John Doe',
              email: 'john@example.com',
              image: null,
              createdAt: '2023-02-20',
            },
            {
              id: '3',
              name: 'Alice Johnson',
              email: 'alice@example.com',
              image: null,
              createdAt: '2023-03-10',
            },
            {
              id: '4',
              name: 'Test Admin',
              email: 'test@gmail.com',
              image: null,
              createdAt: '2023-01-01',
            },
          ]);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch users');
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/admin');
      } else if (status === 'authenticated') {
        setError('Unauthorized: Admin access only');
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome, {session?.user?.name || 'Admin'}. This page is only accessible with the admin credentials.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">All Users ({users.length})</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-lg text-gray-400">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <span>{user.name || 'Unnamed User'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button 
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => alert(`View user details for ${user.name}`)}
                    >
                      View
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => alert(`Delete user ${user.name}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
} 