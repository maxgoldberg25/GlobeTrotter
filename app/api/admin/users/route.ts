import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you can modify this check based on your admin criteria)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.email !== 'test@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users excluding sensitive information
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            photos: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error in admin users route:', error);
    return NextResponse.json(
      { error: 'Internal server error', users: [] },
      { status: 500 }
    );
  }
} 