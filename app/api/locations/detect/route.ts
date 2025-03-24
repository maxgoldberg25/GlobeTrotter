import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { detectImageLocation } from '@/lib/picarta';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, imageBase64 } = body;
    const imageSource = imageBase64 || imageUrl;
    
    if (!imageSource) {
      return NextResponse.json(
        { error: 'Image source (URL or base64) is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PICARTA_API_KEY;
    if (!apiKey) {
      console.error('Picarta API key not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    console.log('Calling Picarta AI detection service...');
    const locationData = await detectImageLocation(imageSource, apiKey);
    
    if (!locationData || locationData.length === 0) {
      return NextResponse.json(
        { error: 'Could not detect location' },
        { status: 404 }
      );
    }

    console.log('Picarta detection successful, returning data');
    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Error in location detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect location', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 