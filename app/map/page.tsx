"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(
  () => import('../components/LeafletMap'),
  { ssr: false }
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
      
      <div className="h-screen w-full pt-16">
        <MapContainer
          center={[photos[0].latitude, photos[0].longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {photos.map(photo => (
            <Marker
              key={photo.id}
              position={[photo.latitude, photo.longitude]}
            >
              <Popup>
                <div className="max-w-xs">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-32 object-cover mb-2"
                  />
                  <h3 className="font-bold">{photo.title}</h3>
                  <p className="text-sm">{photo.location}</p>
                  <p className="text-xs text-gray-500">By {photo.user.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-6 text-gray-600 text-sm">
        <p>Click on a marker to view photo details. Use the controls to zoom and pan around the map.</p>
      </div>
    </div>
  );
} 