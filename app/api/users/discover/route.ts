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

    // Get the current user's ID
    const currentUserId = session.user.id;

    // Find users that the current user is not already following
    // and exclude the current user from results
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // Exclude current user
        },
        followers: {
          none: {
            followerId: currentUserId, // Exclude users that the current user already follows
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 50, // Limit to 50 results for performance
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error discovering users:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
} 