"use client";

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    fetch('/api/photos/locations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch photos');
        return res.json();
      })
      .then(data => {
        console.log('Received photos:', data);
        setPhotos(data);
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