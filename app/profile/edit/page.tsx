"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/edit');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      // Fetch user profile
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setUserProfile(data);
          setName(data.name || '');
          setBio(data.bio || '');
          setImageUrl(data.image || '');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio,
          image: imageUrl
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Update session name if changed
        if (session?.user && name !== session.user.name) {
          // Note: This doesn't update the session name immediately. 
          // User will see updated name after next login or page refresh.
        }
      } else {
        setMessage({ text: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'An error occurred while updating your profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!userProfile) {
    return <div className="container mx-auto p-4">User not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-14">
      <div className="mb-6">
        <Link href="/profile" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Profile
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:mr-8 mb-6 md:mb-0 flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name || 'User'}
                      fill
                      sizes="(max-width: 768px) 160px, 160px"
                      className="object-cover bg-white"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-blue-600 text-white text-4xl font-bold">
                      {name ? name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image URL"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a URL for your profile image</p>
              </div>
              
              <div className="flex-1 w-full">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={userProfile.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Your email"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 