'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sample data for locations with photos
const sampleLocations = [
  {
    id: 1,
    position: [48.8584, 2.2945],
    title: 'Eiffel Tower',
    description: 'The iconic iron lattice tower on the Champ de Mars in Paris, France.',
    imageUrl: '/images/map/eiffel.jpg',
    user: 'traveler123'
  },
  {
    id: 2,
    position: [45.4408, 12.3155],
    title: 'Venice',
    description: 'The beautiful canal city in northeastern Italy, famous for its historic architecture and gondolas.',
    imageUrl: '/images/map/venice.jpg',
    user: 'italy_lover'
  },
  {
    id: 3,
    position: [35.0394, 135.7292],
    title: 'Kinkaku-ji Temple',
    description: 'The famous golden pavilion in Kyoto, Japan surrounded by beautiful gardens.',
    imageUrl: '/images/map/kyoto.jpg',
    user: 'zen_traveler'
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