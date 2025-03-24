"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function MapComponent() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(Date.now()); // Add a key to force remount

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      // Add random query param to bypass any browser caching
      const timestamp = Date.now();
      const response = await fetch(`/api/photos/locations?t=${timestamp}&fresh=true`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received photos data: ${JSON.stringify(data)}`);
      
      // Ensure each photo has valid coordinates
      const validPhotos = data.filter((photo: any) => 
        photo && 
        typeof photo.latitude === 'number' && 
        typeof photo.longitude === 'number' &&
        !isNaN(photo.latitude) && 
        !isNaN(photo.longitude)
      );
      
      console.log(`Valid photos: ${validPhotos.length} of ${data.length}`);
      setPhotos(validPhotos);
      setError(null);
    } catch (error) {
      console.error('Error fetching photos:', error);
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
    <MapContainer
      key={key} // Force remount when key changes
      center={[photos[0].latitude, photos[0].longitude]}
      zoom={13}
      style={{ height: 'calc(100vh - 4rem)', width: '100%' }}
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
              {photo.location && <p className="text-sm">{photo.location}</p>}
              <p className="text-xs text-gray-500">By {photo.user.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 