import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Fetching photos with location data...");
    
    // Modify the Prisma query to not include publicId
    const photos = await prisma.photo.findMany({
      where: {
        AND: [
          {
            latitude: {
              not: null
            }
          },
          {
            longitude: {
              not: null
            }
          }
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
    });

    console.log(`Found ${photos.length} photos with location data`);
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photo locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo locations", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 