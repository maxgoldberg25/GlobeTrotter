import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Follow POST - Session:", session?.user?.id ? 
      `User ID: ${session.user.id}` : "No user ID in session");
    
    if (!session?.user?.id) {
      console.log("Follow POST - Unauthorized: No user ID in session");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId } = body;
    console.log(`Follow POST - Target user ID: ${targetUserId}`);
    
    if (!targetUserId) {
      console.log("Follow POST - Missing targetUserId");
      return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: targetUserId
      }
    });

    if (existingFollow) {
      console.log(`Follow POST - Already following user ${targetUserId}`);
      return NextResponse.json({ error: 'Already following' }, { status: 400 });
    }

    console.log(`Follow POST - Creating follow record from ${session.user.id} to ${targetUserId}`);
    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId
      }
    });

    console.log("Follow POST - Success:", follow);
    return NextResponse.json(follow);
  } catch (error) {
    console.error('Follow POST error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');
    
    if (!targetUserId) return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 });

    await prisma.follow.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: targetUserId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 