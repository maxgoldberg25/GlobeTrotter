"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(
  () => import('../components/LeafletMap'),
  { ssr: false }
);

interface Photo {
  id: string | number;
  title: string;
  imageUrl: string;
  location: string;
  latitude: number;
  longitude: number;
  userId: string;
  userName?: string;
}

export default function MapPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch photos with location data
    const fetchPhotos = async () => {
      try {
        console.log("Fetching photo locations from API...");
        const response = await fetch('/api/photos/locations');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error details:", errorData);
          throw new Error(`API Error (${response.status}): ${errorData.details || errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log(`Received ${Array.isArray(data) ? data.length : 0} photos from API`);
        setPhotos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching photo locations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photo locations. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, []);
  
  useEffect(() => {
    // If no photos were found and we're not loading anymore, use mock data
    if (!loading && photos.length === 0 && !error) {
      console.log("No photos found, using mock data");
      
      // Mock data for testing the map
      const mockPhotos = [
        {
          id: 1,
          title: "Golden Gate Bridge",
          imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
          location: "San Francisco, CA",
          latitude: 37.8199,
          longitude: -122.4783,
          userId: "1",
          userName: "Test User"
        },
        {
          id: 2,
          title: "Statue of Liberty",
          imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a",
          location: "New York, NY",
          latitude: 40.6892,
          longitude: -74.0445,
          userId: "1",
          userName: "Test User"
        },
        {
          id: 3,
          title: "Eiffel Tower",
          imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
          location: "Paris, France",
          latitude: 48.8584,
          longitude: 2.2945,
          userId: "1",
          userName: "Test User"
        }
      ];
      
      setPhotos(mockPhotos);
    }
  }, [loading, photos.length, error]);
  
  return (
    <div className="container mx-auto px-6 py-14">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
        
        <Link href="/photos/upload" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Upload Photo
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Explore Photos on the Map</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
          <div className="text-gray-600">Loading map...</div>
        </div>
      ) : (
        <div className="h-[calc(100vh-200px)] w-full rounded-lg shadow-md overflow-hidden" style={{ minHeight: '500px' }}>
          <LeafletMap photos={photos} />
        </div>
      )}
      
      <div className="mt-6 text-gray-600 text-sm">
        <p>Click on a marker to view photo details. Use the controls to zoom and pan around the map.</p>
      </div>
    </div>
  );
} 