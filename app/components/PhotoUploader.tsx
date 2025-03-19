'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Location {
  lat: number;
  lng: number;
}

// Marker selector component for the map
function LocationMarker({ position, setPosition }: { position: Location | null, setPosition: (pos: Location) => void }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      interactive={false}
    />
  ) : null;
}

export default function PhotoUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fix the missing icon issue in Leaflet with Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    // Remove the file and its preview
    setFiles(files.filter((_, i) => i !== index));
    
    // Also revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert('Please select at least one photo to upload');
      return;
    }
    
    if (!position) {
      alert('Please select a location on the map');
      return;
    }
    
    setIsUploading(true);
    
    // In a real implementation, you would upload the files to your server/cloud storage
    try {
      // Simulating upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Upload data:', {
        files,
        title,
        description,
        position,
        locationName
      });
      
      // Clear the form
      setFiles([]);
      setPreviews([]);
      setTitle('');
      setDescription('');
      setPosition(null);
      setLocationName('');
      
      alert('Photos uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Upload Travel Photos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo upload area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Photos</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              Click to select photos or drag and drop them here
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
          </div>
        </div>
        
        {/* Preview area */}
        {previews.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Selected Photos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Photo details */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 border"
              placeholder="Add a title for your photos"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 border"
              placeholder="Share details about your experience..."
            />
          </div>
        </div>
        
        {/* Location selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="h-60 rounded-lg overflow-hidden">
            <MapContainer
              center={[20, 0]}
              zoom={1}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500">
            {position ? `Selected location: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Click on the map to set the location'}
          </p>
          
          <div>
            <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 border"
              placeholder="e.g., Eiffel Tower, Paris, France"
            />
          </div>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isUploading || files.length === 0 || !position}
            className={`btn-primary w-full ${(isUploading || files.length === 0 || !position) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </form>
    </div>
  );
} 