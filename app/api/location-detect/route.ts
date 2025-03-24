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
      console.error('Picarta API key not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error', details: 'Picarta API key not found' },
        { status: 500 }
      );
    }

    console.log('Calling actual Picarta API with image data...');
    
    // Prepare the payload according to Picarta's API documentation
    const payload = {
      "TOKEN": apiKey,
      "IMAGE": imageSource,
      "TOP_K": 3 // You can choose up to 10 GPS predictions
    };

    // Make the real API call to Picarta
    const apiResponse = await fetch('https://picarta.ai/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      console.error(`Picarta API error: ${apiResponse.status}`);
      const errorText = await apiResponse.text().catch(() => 'No response body');
      console.error('Error details:', errorText);
      return NextResponse.json(
        { error: 'Failed to detect location from external API', details: errorText },
        { status: 500 }
      );
    }

    // Parse the actual API response
    const picartaData = await apiResponse.json();
    console.log('Raw Picarta API response:', JSON.stringify(picartaData, null, 2));
    
    // Process and format the predictions from the real API
    if (picartaData && Array.isArray(picartaData.predictions) && picartaData.predictions.length > 0) {
      const predictions = picartaData.predictions.map((prediction: any) => ({
        latitude: prediction.latitude,
        longitude: prediction.longitude,
        confidence: prediction.confidence,
        locationName: prediction.location_name || undefined
      }));
      
      console.log('Processed predictions from actual API:', predictions);
      return NextResponse.json(predictions);
    }
    
    return NextResponse.json(
      { error: 'No location predictions found in API response' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in location detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect location', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 