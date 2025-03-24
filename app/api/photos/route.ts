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

    console.log("Session user info:", session.user);
    
    const data = await request.json();
    console.log("API received data:", data);
    
    // Validate required fields
    if (!data.title || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    // First check if the user exists
    let user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // If user not found, try to create them
    if (!user) {
      console.log(`User not found with email: ${session.user.email}. Attempting to create.`);
      try {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'User',
            // Add any other required fields with default values
          },
        });
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Failed to create user:", createError);
        return NextResponse.json(
          { error: 'Authentication error. Please log out and sign in again.' },
          { status: 401 }
        );
      }
    }

    // Create photo with direct userId
    const photoData = {
      title: data.title,
      imageUrl: data.imageUrl,
      location: data.location || null,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      userId: user.id,
    };

    console.log("Creating photo with data:", photoData);

    // Create photo
    const photo = await prisma.photo.create({
      data: photoData,
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo', details: error instanceof Error ? error.message : 'Unknown error' },
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