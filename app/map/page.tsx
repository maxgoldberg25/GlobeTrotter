"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(
  () => import('../components/MapComponent'), // Create this file
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  location: string;
  user: {
    name: string;
  };
}

export default function MapPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching photo locations from API...');
    fetch('/api/photos/locations')
      .then(res => {
        console.log('API Response status:', res.status);
        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Received photos data:', data);
        if (Array.isArray(data)) {
          setPhotos(data);
        } else {
          console.error('Unexpected data format:', data);
          setError('Invalid data format received');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading photos:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading map data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!photos.length) {
    return <div className="p-4">No photos with location data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-20">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Photos on the Map</h1>
            <p className="text-gray-400">Discover amazing photos from around the world</p>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </Link>
            
            <Link 
              href="/photos/upload" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Upload Photo
            </Link>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border-2 border-gray-700" style={{ height: 'calc(100vh - 200px)' }}>
            <Suspense fallback={<LoadingSpinner />}>
              <MapWithNoSSR />
            </Suspense>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            <p>Click on a marker to view photo details. Use the controls to zoom and pan around the map.</p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Your Photos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Other Photos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 