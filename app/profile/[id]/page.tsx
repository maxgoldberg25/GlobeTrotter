import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import FollowButton from '@/app/components/FollowButton';
import { redirect, notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: { id: string } }) {
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
          photos: true,
          followers: true,
          following: true
        }
      }
    },
  });

  if (!user) {
    notFound();
  }

  // Check if current user is following this user
  let isFollowing = false;
  
  if (session?.user?.id && session.user.id !== userId) {
    const followRecord = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
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
    <div className="container mx-auto px-6 py-14">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:mr-8 mb-6 md:mb-0">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    fill
                    sizes="(max-width: 768px) 160px, 160px"
                    className="object-cover bg-white"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-blue-600 text-white text-4xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {user.bio && (
                <div className="mb-6 bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <span className="block text-xl font-bold">{user._count?.photos || 0}</span>
                  <span className="text-gray-600">Photos</span>
                </div>
                
                <Link href={`/profile/${userId}/followers`} className="text-center hover:bg-gray-100 p-3 rounded transition">
                  <span className="block text-xl font-bold">{user._count?.followers || 0}</span>
                  <span className="text-gray-600">Followers</span>
                </Link>
                
                <Link href={`/profile/${userId}/following`} className="text-center hover:bg-gray-100 p-3 rounded transition">
                  <span className="block text-xl font-bold">{user._count?.following || 0}</span>
                  <span className="text-gray-600">Following</span>
                </Link>
              </div>
              
              {session?.user?.id && session.user.id !== userId ? (
                <FollowButton userId={userId} isFollowing={isFollowing} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 