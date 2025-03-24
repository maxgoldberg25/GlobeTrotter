'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export default function FollowButton({ userId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleFollow = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/follow?targetUserId=${userId}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error('Failed to unfollow');
      } else {
        // Follow
        const response = await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId: userId })
        });
        
        if (!response.ok) throw new Error('Failed to follow');
      }
      
      setIsFollowing(!isFollowing);
      // Force a hard refresh to update follower counts
      window.location.reload();
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button on your own profile
  if (session?.user?.id === userId) return null;

  return (
    <button
      onClick={handleFollow}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md transition-colors ${
        isFollowing 
          ? isHovering
            ? 'bg-red-600 text-white hover:bg-red-700' // Hover state for unfollow
            : 'bg-gray-600 text-white hover:bg-gray-700' // Normal following state
          : 'bg-blue-500 text-white hover:bg-blue-600' // Not following state
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        isFollowing
          ? (isHovering ? 'Unfollow' : 'Following')
          : 'Follow'
      )}
    </button>
  );
} 