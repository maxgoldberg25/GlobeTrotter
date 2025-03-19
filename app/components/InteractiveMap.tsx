'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sample data for locations with photos
const sampleLocations = [
  {
    id: 1,
    position: [40.7128, -74.0060],
    title: 'New York City',
    description: 'The Big Apple',
    imageUrl: 'https://via.placeholder.com/150',
    user: 'johndoe'
  },
  {
    id: 2,
    position: [48.8566, 2.3522],
    title: 'Paris',
    description: 'City of Lights',
    imageUrl: 'https://via.placeholder.com/150',
    user: 'janedoe'
  },
  {
    id: 3,
    position: [35.6762, 139.6503],
    title: 'Tokyo',
    description: 'Japan\'s capital',
    imageUrl: 'https://via.placeholder.com/150',
    user: 'bobsmith'
  }
];

export default function InteractiveMap() {
  // Hover state for marker highlights
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  
  useEffect(() => {
    // Fix the missing icon issue in Leaflet with Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
  
  return (
    <div className="h-[70vh] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={[20, 0]} // Center map at 0,0 coordinates (middle of the world)
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {sampleLocations.map((location) => (
          <Marker 
            key={location.id}
            position={location.position as [number, number]}
            eventHandlers={{
              mouseover: () => setActiveMarkerId(location.id),
              mouseout: () => setActiveMarkerId(null),
              click: () => console.log(`Clicked on ${location.title}`)
            }}
          >
            <Popup>
              <div className="w-60">
                <h3 className="font-semibold text-lg">{location.title}</h3>
                <img 
                  src={location.imageUrl} 
                  alt={location.title} 
                  className="my-2 rounded-md w-full h-32 object-cover"
                />
                <p className="text-sm text-gray-600">{location.description}</p>
                <p className="text-xs text-gray-500 mt-2">Shared by @{location.user}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 