import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const following = await prisma.follow.findMany({
      where: {
        followerId: session.user.id,
      },
      include: {
        following: true,
      },
    });

    // Format the response to return an array of user objects
    const formattedFollowing = following.map(follow => ({
      id: follow.following.id,
      name: follow.following.name,
      email: follow.following.email,
      image: follow.following.image
    }));

    // Return an empty array if not following anyone
    return NextResponse.json(formattedFollowing);
  } catch (error) {
    console.error('Error fetching following:', error);
    // Return an empty array instead of an error to prevent frontend errors
    return NextResponse.json([], { status: 200 });
  }
} 