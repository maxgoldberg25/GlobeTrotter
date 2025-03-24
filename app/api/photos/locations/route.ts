import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("API: Fetching photo locations...");
    
    // Alternative approach - fetch all photos and filter in-code
    const photos = await prisma.photo.findMany({
      where: {
        AND: [
          {
            latitude: {
              not: undefined
            }
          },
          {
            longitude: {
              not: undefined
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(`API: Found ${photos.length} photos with location data out of ${photos.length} total photos`);
    
    // Format the photos for the frontend
    const formattedPhotos = photos.map(photo => ({
      id: photo.id,
      title: photo.title,
      imageUrl: photo.imageUrl,
      location: photo.location || 'Unknown location',
      latitude: photo.latitude,
      longitude: photo.longitude,
      userId: photo.userId,
      userName: photo.user?.name,
    }));
    
    return NextResponse.json(formattedPhotos);
  } catch (error) {
    console.error('Error fetching photo locations:', error);
    // Return more detailed error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to fetch photo locations', 
      details: errorMessage,
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
} 