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

    const followers = await prisma.follow.findMany({
      where: {
        followingId: session.user.id,
      },
      include: {
        follower: true,
      },
    });

    // Format the response to return an array of user objects
    const formattedFollowers = followers.map(follow => ({
      id: follow.follower.id,
      name: follow.follower.name,
      email: follow.follower.email,
      image: follow.follower.image
    }));

    // Return an empty array if no followers
    return NextResponse.json(formattedFollowers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    // Return an empty array instead of an error to prevent frontend errors
    return NextResponse.json([], { status: 200 });
  }
} 