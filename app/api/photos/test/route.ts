import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Count all photos
    const totalPhotos = await prisma.photo.count();
    
    // Count photos with location data - fixed filter syntax
    const photosWithLocation = await prisma.photo.count({
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
    });
    
    return NextResponse.json({ 
      totalPhotos, 
      photosWithLocation,
      message: photosWithLocation === 0 ? "No photos with location data found" : "Photos with location data exist"
    });
  } catch (error) {
    console.error('Error checking photos:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
} 