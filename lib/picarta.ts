// Utility for Picarta AI location detection

export interface PicartaLocation {
  latitude: number;
  longitude: number;
  confidence: number;
  locationName?: string;
}

/**
 * Detects the location of an image using Picarta AI API
 * @param imageSource URL or base64 of the image to analyze
 * @param apiKey Picarta API key
 * @returns Promise with location data or null if detection failed
 */
export async function detectImageLocation(
  imageSource: string, 
  apiKey: string,
  options?: {
    centerLatitude?: number;
    centerLongitude?: number;
    radius?: number;
    topK?: number;
  }
): Promise<PicartaLocation[] | null> {
  try {
    // Prepare the payload according to Picarta's API documentation
    const payload = {
      "TOKEN": apiKey,
      "IMAGE": imageSource,
      "TOP_K": options?.topK || 3,
      "Center_LATITUDE": options?.centerLatitude || null,
      "Center_LONGITUDE": options?.centerLongitude || null,
      "RADIUS": options?.radius || null,
    };

    console.log('Sending request to Picarta API...');
    
    const response = await fetch('https://picarta.ai/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      console.error('Picarta API error:', errorText || response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Picarta API raw response:', data);
    
    // Check if the API returned location data
    if (data && Array.isArray(data.predictions) && data.predictions.length > 0) {
      return data.predictions.map((prediction: any) => ({
        latitude: prediction.latitude,
        longitude: prediction.longitude,
        confidence: prediction.confidence,
        locationName: prediction.location_name || undefined
      }));
    }
    
    return null;
  } catch (error) {
    console.error('Error in Picarta API call:', error);
    return null;
  }
} 