import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

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
      console.error('Picarta API key missing');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Prepare payload according to Picarta's requirements
    const payload = {
      TOKEN: apiKey,
      IMAGE: imageBase64 ? imageBase64.split(',')[1] : imageUrl, // Remove base64 prefix if present
      TOP_K: 3,
      Center_LATITUDE: null,
      Center_LONGITUDE: null,
      RADIUS: null
    };

    const response = await fetch("https://picarta.ai/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Picarta API error:', errorText);
      return NextResponse.json(
        { error: `Picarta API error: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    if (!result?.predictions || result.predictions.length === 0) {
      return NextResponse.json(
        { error: "No location predictions found" },
        { status: 404 }
      );
    }

    // Map Picarta's response to our format
    const locations = result.predictions.map((pred: any) => ({
      latitude: pred.latitude,
      longitude: pred.longitude,
      confidence: pred.probability,
      locationName: pred.place
    }));

    return NextResponse.json(locations);

  } catch (error) {
    console.error('Location detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 