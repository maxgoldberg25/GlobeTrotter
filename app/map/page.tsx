'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the InteractiveMap component with no SSR
// This is necessary because Leaflet requires the window object
const InteractiveMap = dynamic(
  () => import('../components/InteractiveMap'),
  { ssr: false }
);

export default function Map() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Interactive Travel Map</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Map container */}
          <div className="p-4">
            <InteractiveMap />
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Explore Travel Photos</h2>
            <p className="text-gray-600 mb-4">
              Browse the map to discover photos from travelers around the world. Click on markers to see photos and details.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                Popular Destinations
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                Friends' Photos
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                Recent Uploads
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                My Photos
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add Your Travel Photos</h2>
          <p className="text-gray-600 mb-4">
            Share your travel experiences by uploading photos and tagging their locations on the map.
          </p>
          <Link href="/upload">
            <button className="btn-primary">Upload Photos</button>
          </Link>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Popular Travel Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample photo cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Eiffel Tower"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Eiffel Tower</h3>
                <p className="text-gray-600 text-sm">Paris, France</p>
                <p className="text-gray-700 mt-2">Amazing view from the top of the iconic landmark!</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span className="mr-4">Posted by @traveler123</span>
                  <span>42 likes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Venice Canals"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Grand Canal</h3>
                <p className="text-gray-600 text-sm">Venice, Italy</p>
                <p className="text-gray-700 mt-2">A magical gondola ride through the historic canals.</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span className="mr-4">Posted by @italy_lover</span>
                  <span>38 likes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1546412414-e1885e51148b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Kyoto Temple"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Kinkaku-ji Temple</h3>
                <p className="text-gray-600 text-sm">Kyoto, Japan</p>
                <p className="text-gray-700 mt-2">The golden pavilion reflected in the peaceful pond.</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span className="mr-4">Posted by @zen_traveler</span>
                  <span>56 likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 