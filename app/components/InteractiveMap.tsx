'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';

// Define the SampleLocation interface based on our sample data structure
interface SampleLocation {
  id: number;
  position: [number, number];
  title: string;
  description: string;
  imageUrl: string;
  user: string;
}

// Sample data for locations with photos
const sampleLocations: SampleLocation[] = [
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

// Fix Leaflet marker icon issues on client side
const useLeafletIcon = () => {
  const [icon, setIcon] = useState<L.Icon | null>(null);
  
  useEffect(() => {
    // Fix the issue with Leaflet icons in Next.js
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

export default function InteractiveMap() {
  const [activeLocation, setActiveLocation] = useState<SampleLocation | null>(null);
  const icon = useLeafletIcon();
  
  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Display sample locations */}
        {sampleLocations.map((location) => (
          <Marker 
            key={location.title} 
            position={location.position}
            icon={icon || new L.Icon.Default()}
            eventHandlers={{
              click: () => {
                setActiveLocation(location);
              },
            }}
          />
        ))}
        
        {/* Custom popup for the active location */}
        {activeLocation && (
          <Popup
            position={activeLocation.position}
            eventHandlers={{
              popupclose: () => setActiveLocation(null)
            }}
          >
            <div className="w-64 p-1">
              <h3 className="text-lg font-semibold mb-1">{activeLocation.title}</h3>
              <div className="mb-2 overflow-hidden rounded-md">
                <Image
                  src={activeLocation.imageUrl}
                  alt={activeLocation.title}
                  width={250}
                  height={150}
                  className="object-cover"
                />
              </div>
              <p className="text-sm mb-2">{activeLocation.description}</p>
              <div className="text-xs text-gray-500">
                <span>Photo by @{activeLocation.user}</span>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
} 