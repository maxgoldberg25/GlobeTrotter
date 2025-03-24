import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable route caching completely
export const revalidate = 0; // Disable revalidation cache

export async function GET() {
  try {
    // Force disconnection and reconnection to get fresh data
    await prisma.$disconnect();
    await prisma.$connect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log total count for debugging
    const totalCount = await prisma.photo.count();
    console.log(`Total photos in database: ${totalCount}`);

    // Get all photos with coordinates
    const photos = await prisma.photo.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        location: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${photos.length} photos with coordinates`);
    
    // Explicitly convert decimal values to numbers
    const formattedPhotos = photos.map(photo => ({
      ...photo,
      latitude: Number(photo.latitude),
      longitude: Number(photo.longitude)
    }));

    console.log('Returning photo data:', formattedPhotos);

    // Create response with strong no-cache headers
    const response = NextResponse.json(formattedPhotos);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('Error fetching photo locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo locations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect after request to ensure fresh connection next time
    await prisma.$disconnect();
  }
} 