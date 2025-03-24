import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, imageUrl, location, latitude, longitude } = await request.json();

    // Validate required fields
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    console.log('Creating photo with coordinates:', {
      latitude: typeof latitude === 'string' ? parseFloat(latitude) : latitude,
      longitude: typeof longitude === 'string' ? parseFloat(longitude) : longitude
    });

    // Create photo with proper type handling for coordinates
    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        title,
        imageUrl,
        location: location || null,
        // Proper type handling for latitude/longitude
        latitude: latitude ? 
          (typeof latitude === 'string' ? parseFloat(latitude) : latitude) : 
          null,
        longitude: longitude ? 
          (typeof longitude === 'string' ? parseFloat(longitude) : longitude) : 
          null,
      },
    });

    console.log('Created photo:', photo);
    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create photo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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