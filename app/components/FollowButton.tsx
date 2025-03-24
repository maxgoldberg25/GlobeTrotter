'use client';

import { useState, MouseEvent } from 'react';
import { useSession } from 'next-auth/react';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onUnfollowed?: (userId: string) => void;
}

export default function FollowButton({ userId, isFollowing: initialIsFollowing, onUnfollowed }: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!session || session.user.id === userId) {
    return null;
  }

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isFollowing) {
        console.log(`Attempting to unfollow user ${userId}`);
        const response = await fetch(`/api/follow/${userId}`, {
          method: 'DELETE',
        });
        
        console.log(`Unfollow response status: ${response.status}`);
        const data = await response.json();
        console.log('Unfollow response data:', data);

        if (response.ok) {
          setIsFollowing(false);
          
          // Call the callback if provided
          if (onUnfollowed) {
            onUnfollowed(userId);
          }
        } else {
          console.error('Failed to unfollow:', data.error);
          setErrorMessage(data.error || 'Failed to unfollow user');
        }
      } else {
        // Follow
        const response = await fetch('/api/follow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUserId: userId }),
        });

        if (response.ok) {
          setIsFollowing(true);
        } else {
          console.error('Failed to follow');
        }
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setErrorMessage('Network error occurred');
    } finally {
      setIsLoading(false);
      setIsHovering(false);
    }
  };

  // Button text based on state
  let buttonText = isFollowing
    ? isHovering 
      ? 'Unfollow' 
      : 'Following'
    : 'Follow';
    
  if (isLoading) {
    buttonText = isFollowing ? 'Unfollowing...' : 'Following...';
  }

  // Button styling
  const buttonClass = isFollowing
    ? isHovering 
      ? 'bg-red-500 hover:bg-red-600 text-white' // Unfollow hover state
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300' // Following state
    : 'bg-blue-600 text-white hover:bg-blue-700'; // Follow state

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md transition-colors ${buttonClass} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {buttonText}
      {errorMessage && (
        <div className="absolute mt-1 text-xs text-red-600 bg-red-50 p-1 rounded-md border border-red-100">
          {errorMessage}
        </div>
      )}
    </button>
  );
} 