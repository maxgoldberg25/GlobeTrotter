import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { detectImageLocation } from '@/lib/picarta';

export async function POST(request: Request) {
  try {
    console.log('Mock location detection API called');
    
    // Return mock data to test if the API endpoint is working
    return NextResponse.json([
      {
        latitude: 48.8584,
        longitude: 2.2945,
        confidence: 0.9,
        locationName: "Eiffel Tower, Paris, France"
      },
      {
        latitude: 40.7128,
        longitude: -74.0060,
        confidence: 0.2,
        locationName: "New York, NY, USA"
      }
    ]);
  } catch (error) {
    console.error('Error in mock location detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect location', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 