import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Get all follows
    const allFollows = await prisma.follow.findMany({
      include: {
        follower: {
          select: { id: true, name: true, email: true }
        },
        following: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    // Get current user's follows if logged in
    let userFollows = null;
    if (session?.user?.id) {
      userFollows = {
        following: await prisma.follow.findMany({
          where: { followerId: session.user.id },
          include: {
            following: {
              select: { id: true, name: true, email: true }
            }
          }
        }),
        followers: await prisma.follow.findMany({
          where: { followingId: session.user.id },
          include: {
            follower: {
              select: { id: true, name: true, email: true }
            }
          }
        })
      };
    }
    
    return NextResponse.json({
      success: true,
      session: {
        exists: !!session,
        userId: session?.user?.id
      },
      allFollows,
      userFollows
    });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
} 