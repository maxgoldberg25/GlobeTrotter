import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Starting photo location fetch...");
    
    // First, let's count all photos
    const totalPhotos = await prisma.photo.count();
    console.log("Total photos in database:", totalPhotos);
    
    // Simplified query to check all photos with their coordinates
    const allPhotosWithCoords = await prisma.photo.findMany({
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

    console.log("All photos with their coordinates:", 
      allPhotosWithCoords.map(p => ({
        id: p.id,
        title: p.title,
        lat: p.latitude,
        lng: p.longitude,
        createdAt: p.createdAt
      }))
    );

    // Filter photos with coordinates in JavaScript to debug
    const validPhotos = allPhotosWithCoords.filter(p => 
      p.latitude !== null && 
      p.longitude !== null &&
      !isNaN(Number(p.latitude)) && 
      !isNaN(Number(p.longitude))
    );

    console.log("Valid photos after filtering:", 
      validPhotos.map(p => ({
        id: p.id,
        title: p.title,
        lat: p.latitude,
        lng: p.longitude
      }))
    );

    return NextResponse.json(validPhotos);
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