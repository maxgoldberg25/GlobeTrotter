import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: session.user.id,
      },
      include: {
        follower: true,
      },
    });

    const formattedFollowers = followers.map(follow => follow.follower);
    return NextResponse.json(formattedFollowers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Error fetching followers' }, { status: 500 });
  }
} 