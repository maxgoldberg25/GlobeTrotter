import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // First get total count for debugging
    const totalCount = await prisma.photo.count();
    console.log("Total photos in database:", totalCount);

    const photos = await prisma.$transaction(async (tx) => {
      // Get all photos with coordinates
      const results = await tx.photo.findMany({
        where: {
          AND: [
            { latitude: { not: undefined } },
            { longitude: { not: undefined } },
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

      console.log(`Found ${results.length} photos with coordinates out of ${totalCount} total photos`);
      return results;
    });

    // Log each photo for debugging
    photos.forEach(photo => {
      console.log(`Photo ${photo.id}: ${photo.title} at [${photo.latitude}, ${photo.longitude}]`);
    });

    const response = NextResponse.json(photos);
    
    // Prevent caching at all levels
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;

  } catch (error) {
    console.error("Error in photos/locations API:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch photo locations", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 