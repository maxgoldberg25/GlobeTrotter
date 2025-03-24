import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import FollowButton from '@/app/components/FollowButton';
import { redirect, notFound } from 'next/navigation';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = params.id;
  
  if (!session) {
    redirect('/login?callbackUrl=/profile/' + params.id);
  }
  
  // Fetch the user with all needed data
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          photos: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Check if current user is following this user
  let isFollowing = false;
  
  if (session?.user?.id) {
    const followRecord = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: userId
      }
    });
    
    isFollowing = !!followRecord;
  }

  // Format date function
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:mr-6 mb-4 md:mb-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={user.image || '/placeholder-avatar.png'}
                alt={user.name || 'User'}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            
            <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <span className="block text-xl font-bold">{user._count.photos || 0}</span>
                <span className="text-gray-600">Photos</span>
              </div>
              
              <Link href={`/profile/${userId}/followers`} className="text-center hover:bg-gray-100 p-2 rounded transition">
                <span className="block text-xl font-bold">{user._count.followers || 0}</span>
                <span className="text-gray-600">Followers</span>
              </Link>
              
              <Link href={`/profile/${userId}/following`} className="text-center hover:bg-gray-100 p-2 rounded transition">
                <span className="block text-xl font-bold">{user._count.following || 0}</span>
                <span className="text-gray-600">Following</span>
              </Link>
            </div>
            
            <div className="mt-6">
              {session?.user?.id !== user.id && (
                <FollowButton userId={user.id} isFollowing={isFollowing} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 