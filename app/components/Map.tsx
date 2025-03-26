'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSession } from 'next-auth/react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  location: string | null;
  publicId: string | null;
  userEmail: string;
}

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: '/pin.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom hook to handle map updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function Map({ photos }: { photos: Photo[] }) {
  const { data: session } = useSession();
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (photos.length > 0) {
      // Calculate center based on photos
      const latSum = photos.reduce((sum, photo) => sum + (photo.latitude || 0), 0);
      const lngSum = photos.reduce((sum, photo) => sum + (photo.longitude || 0), 0);
      setCenter([latSum / photos.length, lngSum / photos.length]);
      setZoom(3);
    }
  }, [photos]);

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            position={[photo.latitude || 0, photo.longitude || 0]}
            icon={session?.user?.email === photo.userEmail ? userIcon : icon}
          >
            <Popup>
              <div className="p-2">
                <img
                  src={photo.imageUrl}
                  alt={photo.description || 'Photo'}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-700">{photo.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted by {photo.userEmail}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 