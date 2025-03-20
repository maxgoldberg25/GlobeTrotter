"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import PageContainer from "../components/PageContainer";

// Import map component with no SSR to avoid hydration issues
const Map = dynamic(() => import("../components/UploadLocationMap"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>,
});

export default function UploadPhoto() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photoData, setPhotoData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: 0,
    longitude: 0,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setErrorMessage("");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPhotoData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Location selected:", lat, lng);
    setPhotoData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl) {
      setErrorMessage("Please select a photo to upload");
      return;
    }
    
    if (!photoData.title.trim()) {
      setErrorMessage("Please enter a title for your photo");
      return;
    }
    
    if (photoData.latitude === 0 && photoData.longitude === 0) {
      setErrorMessage("Please select a location on the map");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // This would be replaced with an actual API call in production
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to profile page after successful upload
      router.push("/profile");
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrorMessage("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Upload Travel Photo</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          {/* Photo upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Photo</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative h-64 mx-auto">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click to select a photo or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          {/* Photo details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={photoData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sunset at Eiffel Tower"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={photoData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about this photo..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-1">Location Name</label>
              <input
                type="text"
                id="location"
                name="location"
                value={photoData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Paris, France"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Pin Location on Map</label>
              <div className="h-64 rounded-md overflow-hidden border border-gray-300 relative z-0">
                <Map onLocationSelect={handleLocationSelect} />
              </div>
              {photoData.latitude !== 0 && photoData.longitude !== 0 ? (
                <p className="text-sm text-green-600 mt-1">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Location selected: {photoData.latitude.toFixed(4)}, {photoData.longitude.toFixed(4)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Click on the map to select a location for your photo
                </p>
              )}
            </div>
          </div>
          
          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium ${
                isUploading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
              } transition-colors`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Photo"
              )}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
} 