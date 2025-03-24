import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, imageBase64 } = await request.json();
    
    console.log('Location detection API called');
    console.log('Image source received:', imageUrl ? 'URL provided' : imageBase64 ? 'Base64 provided' : 'No image source');
    
    // For now, return a mock response with London coordinates
    // This is a placeholder until Picarta API is integrated
    return NextResponse.json([
      {
        latitude: 51.5074,
        longitude: -0.1278,
        confidence: 0.9,
        locationName: "London, United Kingdom"
      },
      {
        latitude: 40.7128,
        longitude: -74.0060,
        confidence: 0.2,
        locationName: "New York, NY, USA"
      }
    ]);
  } catch (error) {
    console.error('Error in location detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect location', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 