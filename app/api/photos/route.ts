import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Add validation for coordinates
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid coordinates format' },
        { status: 400 }
      );
    }

    // Create the photo with explicit type casting
    const photo = await prisma.photo.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        location: data.location,
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    // Return the complete photo data including coordinates
    return NextResponse.json({
      ...photo,
      latitude: Number(photo.latitude),
      longitude: Number(photo.longitude)
    });

  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all photos for the current user
    const photos = await prisma.photo.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        ...(process.env.NODE_ENV === 'development' ? { publicId: true } : {})
      }
    });
    
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 