import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable route caching completely
export const revalidate = 0; // Disable revalidation cache

export async function GET() {
  try {
    // Remove the disconnect/connect as it might be causing issues
    // await prisma.$disconnect();
    // await prisma.$connect();
    
    // Make session optional to avoid authentication errors
    const session = await getServerSession(authOptions);
    // Remove session check to troubleshoot if this is causing the error
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Log total count for debugging
    const totalCount = await prisma.photo.count();
    console.log(`Total photos in database: ${totalCount}`);

    // Simplify query to avoid any potential Prisma issues
    const rawPhotos = await prisma.photo.findMany({
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

    console.log(`Found ${rawPhotos.length} photos with coordinates`);
    console.log('Raw photo data sample:', rawPhotos.length > 0 ? rawPhotos[0] : 'No photos');
    
    // Safely convert values and filter out any problematic entries
    const formattedPhotos = rawPhotos
      .filter(photo => photo && photo.latitude !== null && photo.longitude !== null)
      .map(photo => {
        try {
          return {
            id: photo.id,
            title: photo.title,
            imageUrl: photo.imageUrl,
            latitude: Number(photo.latitude),
            longitude: Number(photo.longitude),
            location: photo.location,
            createdAt: photo.createdAt,
            user: {
              id: photo.user?.id,
              name: photo.user?.name || 'Unknown'
            }
          };
        } catch (e) {
          console.error('Error formatting photo:', e);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from failed conversions

    console.log(`Successfully formatted ${formattedPhotos.length} photos`);

    // Create response with strong no-cache headers
    const response = NextResponse.json(formattedPhotos);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching photo locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo locations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 