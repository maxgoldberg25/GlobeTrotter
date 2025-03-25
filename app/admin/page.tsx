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
  updatedAt?: string;
  emailVerified?: Date | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (status === 'authenticated' && session?.user?.email === 'test@gmail.com') {
        try {
          setLoading(true);
          
          // Fetch real users from the API
          const response = await fetch('/api/admin/users');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
          }
          
          const data = await response.json();
          setUsers(data.users);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to fetch users from database');
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/admin');
      } else if (status === 'authenticated') {
        setError('Unauthorized: Admin access only');
        setLoading(false);
      }
    };
    
    if (status !== 'loading') {
      fetchUsers();
    }
  }, [status, session, router]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(user => user.id !== userToDelete));
      setDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setDeleteError(err.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
    setDeleteError(null);
  };

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
        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mb-6">
          Welcome, {session?.user?.name || 'Admin'}. This page displays all {users.length} registered users from the database.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">All Users ({users.length})</h2>
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No users found in the database
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800">
                <thead>
                  <tr className="bg-gray-700 border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-700 rounded-full mr-3 flex items-center justify-center overflow-hidden">
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
                          <span className="text-gray-300">{user.name || 'Unnamed User'}</span>
                          {user.email === 'test@gmail.com' && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-900 text-blue-200 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        {user.emailVerified ? (
                          <span className="px-2 py-1 bg-green-900 text-green-200 rounded-full text-xs">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-900 text-yellow-200 rounded-full text-xs">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-300" title={formatDate(user.createdAt)}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/profile/${user.id}`)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          {user.email !== 'test@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border border-gray-600 ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border-t border-b border-gray-600 ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border border-gray-600 ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Confirm Deletion</h3>
            <p className="mb-6 text-gray-400">Are you sure you want to delete this user? This action cannot be undone.</p>
            
            {deleteError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4" role="alert">
                <p>{deleteError}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
} 