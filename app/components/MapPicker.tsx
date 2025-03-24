"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number | string;
  initialLng?: number | string;
}

// Enhanced MapController that handles both center changes and marker updates
function MapController({ 
  center, 
  initialLat, 
  initialLng,
  setMarkerPosition,
  handleReverseGeocode
}: { 
  center?: [number, number],
  initialLat?: number | string,
  initialLng?: number | string,
  setMarkerPosition: (pos: [number, number]) => void,
  handleReverseGeocode: (lat: number, lng: number) => void
}) {
  const map = useMap();
  const processedCoordsRef = useRef<Set<string>>(new Set());
  
  // Handle center changes (from search)
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  // Handle initialLat/initialLng changes (from AI detection)
  useEffect(() => {
    if (initialLat && initialLng) {
      const lat = typeof initialLat === 'string' ? parseFloat(initialLat) : initialLat;
      const lng = typeof initialLng === 'string' ? parseFloat(initialLng) : initialLng;
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        
        // Only process coordinates once to prevent infinite loops
        if (!processedCoordsRef.current.has(coordKey)) {
          console.log("MapController: Updating map with coordinates:", lat, lng);
          processedCoordsRef.current.add(coordKey);
          
          map.setView([lat, lng], 13);
          setMarkerPosition([lat, lng]);
          
          // Only geocode if we haven't seen these coordinates
          handleReverseGeocode(lat, lng);
        }
      }
    }
  }, [initialLat, initialLng, map, setMarkerPosition, handleReverseGeocode]);
  
  return null;
}

function LocationMarker({ 
  onLocationSelect, 
  markerPosition, 
  setMarkerPosition 
}: { 
  onLocationSelect: (lat: number, lng: number, address?: string) => void,
  markerPosition: [number, number] | null,
  setMarkerPosition: (pos: [number, number]) => void
}) {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPos);
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

  return markerPosition ? <Marker position={markerPosition} /> : null;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  
  // Add this at component level - not inside any function
  const geocodeCache = useRef<{[key: string]: string}>({});
  const processedCoordsRef = useRef<Set<string>>(new Set());
  
  // Fix Leaflet icon issues
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  
  // If initial coordinates are provided, use them for the initial center
  useEffect(() => {
    if (initialLat && initialLng) {
      const lat = typeof initialLat === 'string' ? parseFloat(initialLat) : initialLat;
      const lng = typeof initialLng === 'string' ? parseFloat(initialLng) : initialLng;
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // Set these values just once on initial render
        setCenter([lat, lng]);
        setMarkerPosition([lat, lng]);
        
        // We don't need to call handleReverseGeocode here
        // It will be handled by the MapController
      }
    }
  }, [initialLat, initialLng]); // Only run when these values change, not on every render
  
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
        setMarkerPosition([latNum, lonNum]);
        onLocationSelect(latNum, lonNum, display_name);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };
  
  const handleReverseGeocode = async (lat: number, lng: number) => {
    // Create a cache key to prevent duplicate requests
    const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    
    // Now use the ref defined at component level
    // If we already have this location in cache, use it
    if (geocodeCache.current[cacheKey]) {
      const cachedLocation = geocodeCache.current[cacheKey];
      onLocationSelect(lat, lng, cachedLocation);
      setLocation(cachedLocation);
      return;
    }
    
    try {
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'GlobeTrotter App'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.display_name) {
        // Cache the result
        geocodeCache.current[cacheKey] = data.display_name;
        
        // Update state only once
        onLocationSelect(lat, lng, data.display_name);
        setLocation(data.display_name);
      }
    } catch (error) {
      console.error("Error getting location name:", error);
      // Don't retry on error - just use a fallback name
      const fallbackName = `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onLocationSelect(lat, lng, fallbackName);
      setLocation(fallbackName);
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
          <LocationMarker 
            onLocationSelect={onLocationSelect} 
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
          <MapController 
            center={center} 
            initialLat={initialLat}
            initialLng={initialLng}
            setMarkerPosition={setMarkerPosition}
            handleReverseGeocode={handleReverseGeocode}
          />
        </MapContainer>
      </div>
      
      <p className="text-sm text-gray-500">
        Click on the map to select a location, or search for an address above.
      </p>
    </div>
  );
} 