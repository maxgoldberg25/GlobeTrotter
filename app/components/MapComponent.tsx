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

  const fetchPhotos = useCallback(async () => {
    try {
      const timestamp = new Date().getTime(); // Add timestamp to prevent caching
      const response = await fetch(`/api/photos/locations?t=${timestamp}`, {
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
      console.log('Fetched photos:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setPhotos(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Set up polling for updates
  useEffect(() => {
    const interval = setInterval(fetchPhotos, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  // Leaflet icon fix
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
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
    <MapContainer
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
              <p className="text-sm">{photo.location}</p>
              <p className="text-xs text-gray-500">By {photo.user.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 