"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

// Fix the import path - use relative path if @ alias isn't working
const MapPicker = dynamic(
  () => import('../../components/MapPicker'),
  { ssr: false }
);

export default function UploadPhotoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/photos/upload");
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the selected image
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setUseCurrentLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
        
        // Try to get a place name from coordinates
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              setLocation(data.display_name);
            }
          })
          .catch(err => console.error("Error getting location name:", err));
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setUseCurrentLocation(false);
      }
    );
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    
    if (address) {
      setLocation(address);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a title for your photo");
      return;
    }

    if (!imageFile && !imageUrl) {
      setError("Please select an image or enter an image URL");
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      let finalImageUrl = imageUrl;
      
      // If user selected a file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        
        try {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload image");
          }
          
          const uploadData = await uploadResponse.json();
          
          // Now we have the Cloudinary URL and public ID
          finalImageUrl = uploadData.url;
          
          // When creating the photo, include the publicId
          const photoData = {
            title,
            location: location || null,
            latitude: latitude ? Number(latitude) : null,
            longitude: longitude ? Number(longitude) : null,
            imageUrl: finalImageUrl,
          };
          
          const response = await fetch("/api/photos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(photoData),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to save photo");
          }
          
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } catch (error) {
          setError(error instanceof Error ? error.message : "Failed to upload image");
          setUploading(false);
          return;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-14">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Upload a Photo</h1>
      
      {status === "loading" ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title*
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a title for your photo"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Where was this photo taken?"
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Location on Map
                      </label>
                      <MapPicker 
                        onLocationSelect={handleLocationSelect} 
                        initialLat={latitude || undefined}
                        initialLng={longitude || undefined}
                      />
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {useCurrentLocation ? "Getting your location..." : "Use my current location"}
                      </button>
                    </div>
                    
                    {/* Hidden inputs to store the coordinates */}
                    <input type="hidden" name="latitude" value={latitude?.toString() || ''} />
                    <input type="hidden" name="longitude" value={longitude?.toString() || ''} />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo*
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Select Image
                      </label>
                      <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or use an image URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: '300px' }}>
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="max-h-full max-w-full object-contain"
                          onError={() => setError("Invalid image URL")}
                        />
                      ) : (
                        <div className="text-gray-500">
                          No image selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  Photo uploaded successfully! Redirecting...
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 mr-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={uploading || success}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                    (uploading || success) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 