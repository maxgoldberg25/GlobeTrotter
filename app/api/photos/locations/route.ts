import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Starting photo location fetch...");
    
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

    console.log(`Found ${photos.length} photos with location data`);

    // Add cache control headers
    const response = NextResponse.json(photos);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;

  } catch (error) {
    console.error("Error in photos/locations API:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch photo locations", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 