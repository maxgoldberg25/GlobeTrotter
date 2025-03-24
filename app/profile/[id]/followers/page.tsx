import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import FollowButton from '@/app/components/FollowButton';
import { notFound } from 'next/navigation';

export default async function FollowersPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = params.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true
    }
  });
  
  if (!user) {
    notFound();
  }
  
  // Get followers with their follow status
  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId
    },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  // Check which followers the current user is also following
  let followingMap = new Map();
  if (session?.user?.id) {
    const currentUserFollowing = await prisma.follow.findMany({
      where: {
        followerId: session.user.id
      },
      select: {
        followingId: true
      }
    });
    
    currentUserFollowing.forEach(f => followingMap.set(f.followingId, true));
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href={`/profile/${userId}`} className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to {user.name}'s Profile
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Followers</h1>
      
      {followers.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-600">No followers yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {followers.map(follow => (
            <div key={follow.id} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <Link href={`/profile/${follow.follower.id}`} className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={follow.follower.image || '/images/default-avatar.png'}
                    alt={follow.follower.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">{follow.follower.name}</h2>
                </div>
              </Link>
              
              {session?.user?.id && follow.follower.id !== session.user.id && (
                <FollowButton 
                  userId={follow.follower.id} 
                  isFollowing={followingMap.has(follow.follower.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 