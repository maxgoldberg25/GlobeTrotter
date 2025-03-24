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
          {
            latitude: {
              not: null,
            },
          },
          {
            longitude: {
              not: null,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        location: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Found ${photos.length} photos with location data`);
    
    if (photos.length === 0) {
      console.log("No photos found with location data");
    } else {
      console.log("Sample photo data:", JSON.stringify(photos[0], null, 2));
    }

    return NextResponse.json(photos);
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