import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Add these types at the top of the file (under the imports)
interface PicartaLocation {
  latitude: number;
  longitude: number;
  confidence: number;
  locationName: string;
}

interface PicartaResponse {
  ai_lat?: number;
  ai_lon?: number;
  ai_confidence?: number;
  city?: string;
  province?: string;
  ai_country?: string;
  topk_predictions_dict?: {
    [key: string]: {
      gps?: number[];
      confidence?: number;
      address?: {
        city?: string;
        province?: string;
        country?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, imageBase64 } = await request.json();
    const imageSource = imageBase64 || imageUrl;
    
    console.log('Location detection API called');
    console.log('Image source received:', imageUrl ? 'URL provided' : imageBase64 ? 'Base64 provided' : 'No image source');
    
    if (!imageSource) {
      return NextResponse.json(
        { error: 'Image source (URL or base64) is required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.PICARTA_API_KEY;
    console.log('API Key present:', apiKey);
    if (!apiKey) {
      console.error('Picarta API key missing');
      // Fall back to mock data if API key is missing
      return NextResponse.json([
        {
          latitude: 51.5074,
          longitude: -0.1278,
          confidence: 0.9,
          locationName: "London, United Kingdom (mock - missing API key)"
        }
      ]);
    }

    // Add detailed API key logging (safely)
    console.log('API Key details:', {
      present: !!apiKey,
      length: apiKey?.length || 0,
      // Show first and last 3 chars, hide the rest
      preview: apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}` : 'none',
      // Check if it looks like a valid key (no spaces, decent length)
      valid: apiKey && apiKey.trim() === apiKey && apiKey.length > 10
    });

    console.log('Calling Picarta API with API key');
    
    // Prepare image data - strip data URL prefix for base64 if present
    const imageData = imageBase64 
      ? (imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64)
      : imageUrl;
    
    // Log the request details
    console.log('Picarta request details:', {
      url: "https://picarta.ai/classify",
      method: "POST",
      contentType: "application/json",
      imageType: imageBase64 ? 'base64' : 'url',
      imageDataLength: imageData?.length || 0,
      topK: 3
    });

    // Call Picarta API
    const response = await fetch("https://picarta.ai/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "TOKEN": apiKey,
        "IMAGE": imageData,
        "TOP_K": 3,
        "Center_LATITUDE": null,
        "Center_LONGITUDE": null,
        "RADIUS": null,
      }),
    });

    // Log full response details
    console.log('Picarta API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      ok: response.ok
    });

    if (!response.ok) {
      console.error(`Picarta API error: ${response.status} ${response.statusText}`);
      
      // Try to get error response body
      const errorBody = await response.text();
      console.error('Picarta error body:', errorBody);
      
      // Fall back to mock data on API failure
      return NextResponse.json([
        {
          latitude: 51.5074,
          longitude: -0.1278,
          confidence: 0.9,
          locationName: `London, United Kingdom (fallback - API error ${response.status})`
        }
      ]);
    }

    // Parse response
    const responseText = await response.text();
    let result: PicartaResponse;
    try {
      result = JSON.parse(responseText);
      
      // Create locations array from Picarta's response format
      const locations: PicartaLocation[] = [];
      
      // Add the primary prediction from root data
      if (result.ai_lat && result.ai_lon) {
        locations.push({
          latitude: result.ai_lat,
          longitude: result.ai_lon,
          confidence: result.ai_confidence || 0.9,
          locationName: [result.city, result.province, result.ai_country]
            .filter(Boolean)
            .join(", ")
        });
      }
      
      // Add additional predictions from topk_predictions_dict if available
      if (result.topk_predictions_dict) {
        // Use a non-null assertion or explicit type casting
        const predictionsDict = result.topk_predictions_dict as NonNullable<typeof result.topk_predictions_dict>;
        
        Object.keys(predictionsDict).forEach(key => {
          const pred = predictionsDict[key];
          
          // Only add if different from primary prediction
          if (pred && pred.gps && pred.gps.length >= 2) {
            // Check if this is a duplicate of already added location
            const gps = pred.gps; // Store in a variable to avoid repeated undefined checks
            
            const isDuplicate = locations.some(loc => 
              Math.abs(loc.latitude - gps[0]) < 0.001 && 
              Math.abs(loc.longitude - gps[1]) < 0.001
            );
            
            if (!isDuplicate) {
              const address = pred.address || {};
              const locationParts = [
                address.city, 
                address.province,
                address.country
              ].filter(Boolean);
              
              locations.push({
                latitude: gps[0],
                longitude: gps[1],
                confidence: pred.confidence || 0.8,
                locationName: locationParts.length > 0 
                  ? locationParts.join(", ") 
                  : "Unknown location"
              });
            }
          }
        });
      }
      
      // If no locations could be extracted, return an error
      if (locations.length === 0) {
        console.error('Could not extract location data from Picarta response');
        return NextResponse.json(
          { error: "No location predictions found in API response" },
          { status: 404 }
        );
      }
      
      console.log(`Returning ${locations.length} locations from Picarta API`);
      return NextResponse.json(locations);
      
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { error: "Failed to parse location detection response" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in location detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect location', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 