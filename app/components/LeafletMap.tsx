"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

interface LeafletMapProps {
  photos: Photo[];
}

export default function LeafletMap({ photos }: LeafletMapProps) {
  // Calculate the center point of all markers
  const getMapCenter = () => {
    if (photos.length === 0) return [39.8283, -98.5795]; // Default to center of US
    
    const latSum = photos.reduce((sum, photo) => sum + photo.latitude, 0);
    const lngSum = photos.reduce((sum, photo) => sum + photo.longitude, 0);
    return [latSum / photos.length, lngSum / photos.length];
  };
  
  const center: [number, number] = getMapCenter() as [number, number];
  
  return (
    <MapContainer 
      center={center} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                className="w-full h-auto rounded mb-2"
                style={{ maxHeight: '150px', objectFit: 'cover' }}
              />
              <h3 className="font-bold text-lg">{photo.title}</h3>
              <p className="text-gray-600">{photo.location}</p>
              {photo.userName && (
                <p className="text-sm text-gray-500 mt-1">By: {photo.userName}</p>
              )}
              <Link 
                href={`/photos/${photo.id}`}
                className="text-blue-600 hover:text-blue-800 block mt-2"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 