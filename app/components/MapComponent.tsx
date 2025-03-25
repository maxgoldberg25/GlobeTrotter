"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Add custom styles for popup
const popupStyles = `
  .leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .leaflet-popup-tip {
    display: none !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
  }
`;

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  location: string;
  user: {
    name: string;
    email: string;
  };
}

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(Date.now()); // Add a key to force remount
  const { data: session } = useSession();

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      // Add random query param to bypass any browser caching
      const timestamp = Date.now();
      console.log('Fetching photos from API...');
      
      const response = await fetch(`/api/photos/locations?t=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error('API error response:', errorText);
        throw new Error(`API returned status ${response.status}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('API data received successfully');
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Failed to parse API response');
      }
      
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', typeof data);
        throw new Error(`Invalid response format: expected array but got ${typeof data}`);
      }
      
      console.log(`Received ${data.length} photos from API`);
      
      // Ensure each photo has valid coordinates
      const validPhotos = data.filter((photo: any) => {
        if (!photo) {
          console.log('Filtering out null/undefined photo');
          return false;
        }
        
        const hasValidCoords = 
          photo && 
          typeof photo.latitude === 'number' && 
          typeof photo.longitude === 'number' &&
          !isNaN(photo.latitude) && 
          !isNaN(photo.longitude);
        
        if (!hasValidCoords) {
          console.log('Filtering out photo with invalid coordinates:', photo.id);
        }
        
        return hasValidCoords;
      });
      
      console.log(`Valid photos: ${validPhotos.length} of ${data.length}`);
      setPhotos(validPhotos);
      setError(null);
    } catch (error) {
      console.error('Error loading photos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on first load
  useEffect(() => {
    fetchPhotos();
    
    // Force refresh when the component is navigated to
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setKey(Date.now()); // Update key to force refresh
        fetchPhotos();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPhotos]);

  // Refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchPhotos, 5000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  // Fix for Leaflet icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);

  if (loading && photos.length === 0) {
    return <div className="p-4 flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full mb-2"></div>
        <p>Loading map data...</p>
      </div>
    </div>;
  }

  if (error && photos.length === 0) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (photos.length === 0) {
    return <div className="p-4">No photos with location data available.</div>;
  }

  return (
    <>
      <style>{popupStyles}</style>
      <MapContainer
        key={key}
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
            icon={session?.user?.email === photo.user.email ? userIcon : defaultIcon}
          >
            <Popup>
              <div className="max-w-[180px] bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-24 object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-xs font-bold text-white mb-0.5">{photo.title}</h3>
                  {photo.location && (
                    <p className="text-[10px] text-gray-300 flex items-center mb-0.5">
                      <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {photo.location}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 flex items-center">
                    <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    By {photo.user.name}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
} 