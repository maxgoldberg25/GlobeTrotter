"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issues - using useEffect to set this up on the client side
const useLeafletIcon = () => {
  const [icon, setIcon] = useState<L.Icon | null>(null);
  
  useEffect(() => {
    // Fix the issue with Leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    // Set default icon paths directly
    L.Icon.Default.mergeOptions({
      iconUrl: '/images/map/marker-icon.png',
      shadowUrl: '/images/map/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Create and set the icon
    setIcon(new L.Icon({
      iconUrl: '/images/map/marker-icon.png',
      shadowUrl: '/images/map/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }));
  }, []);
  
  return icon;
};

// Create a LocationMarker component that handles map clicks
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const icon = useLeafletIcon();
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      console.log("Map clicked at:", e.latlng.lat, e.latlng.lng);
    },
  });
  
  // Log when icon or position changes to debug
  useEffect(() => {
    if (position) {
      console.log("Position updated:", position);
    }
    if (icon) {
      console.log("Icon loaded successfully");
    }
  }, [position, icon]);
  
  if (position === null || icon === null) return null;
  
  return <Marker position={position} icon={icon} />;
}

interface UploadLocationMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

export default function UploadLocationMap({ 
  onLocationSelect,
  initialPosition 
}: UploadLocationMapProps) {
  // Default center position (can be customized)
  const defaultPosition: [number, number] = initialPosition || [20, 0]; // Center of the world
  
  return (
    <MapContainer
      center={defaultPosition}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
} 