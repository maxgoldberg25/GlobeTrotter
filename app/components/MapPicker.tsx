"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number | string;
  initialLng?: number | string;
}

function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address?: string) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      
      // Attempt reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            onLocationSelect(e.latlng.lat, e.latlng.lng, data.display_name);
          }
        })
        .catch(err => console.error("Error getting location name:", err));
    }
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  
  // Fix Leaflet icon issues - MOVED INSIDE COMPONENT
  useEffect(() => {
    // Fix Leaflet icon issues
    // Use type assertion to avoid TypeScript error
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  
  // If initial coordinates are provided, use them
  useEffect(() => {
    if (initialLat && initialLng) {
      const lat = typeof initialLat === 'string' ? parseFloat(initialLat) : initialLat;
      const lng = typeof initialLng === 'string' ? parseFloat(initialLng) : initialLng;
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
      }
    }
  }, [initialLat, initialLng]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      // Use OpenStreetMap Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        setCenter([latNum, lonNum]);
        onLocationSelect(latNum, lonNum, display_name);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };
  
  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      
      <div style={{ height: '400px', width: '100%' }} className="rounded-md overflow-hidden border border-gray-300">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
          <MapController center={center} />
        </MapContainer>
      </div>
      
      <p className="text-sm text-gray-500">
        Click on the map to select a location, or search for an address above.
      </p>
    </div>
  );
} 