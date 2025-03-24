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
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [shouldUseAI, setShouldUseAI] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file:', file.name, file.type, file.size);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Upload failed:', data);
        toast.error(`Upload failed: ${data.details || data.error || 'Unknown error'}`);
        return null;
      }
      
      console.log('Upload successful:', data);
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    }
  };

  const detectLocation = async (imageSource: string, isBase64: boolean = false): Promise<{success: boolean, lat?: number, lng?: number, name?: string}> => {
    if (!imageSource) return {success: false};
    
    setIsDetectingLocation(true);
    try {
      console.log('Calling location detection API...');
      console.log('Image source type:', isBase64 ? 'base64' : 'url');
      
      const response = await fetch('/api/locations/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isBase64 
            ? { imageBase64: imageSource } 
            : { imageUrl: imageSource }
        ),
      });

      console.log('API status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error('API error response:', errorText);
        throw new Error(`Failed to detect location (${response.status})`);
      }

      const locationData = await response.json();
      console.log('Real Picarta API response received:', locationData);
      
      // Check if we have any predictions
      if (!locationData || !Array.isArray(locationData) || locationData.length === 0) {
        toast.error('No location could be detected for this image');
        return {success: false};
      }
      
      // Find the prediction with highest confidence
      const bestMatch = locationData[0];
      
      // CRITICAL FIX: Return values directly AND update state
      const detectedLat = bestMatch.latitude;
      const detectedLng = bestMatch.longitude;
      const detectedName = bestMatch.locationName || 'Detected location';
      
      console.log('Setting coordinates from real API:', { lat: detectedLat, lng: detectedLng, name: detectedName });
      
      // Update state variables
      setLatitude(detectedLat);
      setLongitude(detectedLng);
      setLocation(detectedName);
      
      toast.success('Location detected successfully!');
      
      // Return the detected values to the caller
      return {
        success: true,
        lat: detectedLat,
        lng: detectedLng,
        name: detectedName
      };
    } catch (error) {
      console.error('Error detecting location:', error);
      toast.error('Could not detect location automatically');
      return {success: false};
    } finally {
      setIsDetectingLocation(false);
      setShouldUseAI(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a title for your photo");
      return;
    }

    if (!imageFile && !imageUrl) {
      setError("Please select an image to upload");
      return;
    }

    // Check if location is missing
    const locationMissing = !latitude || !longitude;

    // If location is missing but AI wasn't explicitly requested, show error
    if (locationMissing && !shouldUseAI) {
      setError("Please select a location on the map");
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      // Upload image if not already uploaded
      let finalImageUrl = imageUrl;
      if (imageFile && !imageUrl) {
        finalImageUrl = await handleImageUpload(imageFile);
        if (!finalImageUrl) {
          setUploading(false);
          return;
        }
      }
      
      // Only use AI detection if the user explicitly selected that option
      let detectedCoords = null;
      if (shouldUseAI && locationMissing) {
        toast('Analyzing image with AI...');
        
        if (imageFile) {
          // For uploads, convert to base64 and detect
          const reader = new FileReader();
          detectedCoords = await new Promise<{success: boolean, lat?: number, lng?: number, name?: string}>((resolve) => {
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              const base64Data = base64.split(',')[1];
              const result = await detectLocation(base64Data, true);
              resolve(result);
            };
            reader.readAsDataURL(imageFile);
          });
        } else if (finalImageUrl) {
          // For image URLs, use the URL
          detectedCoords = await detectLocation(finalImageUrl);
        }
        
        // If detection was requested but failed, inform user and stop
        if (!detectedCoords?.success) {
          setUploading(false);
          setError('AI detection failed. Please select a location manually.');
          return;
        }
        
        // Update the state with detected coordinates
        setLatitude(detectedCoords.lat || null);
        setLongitude(detectedCoords.lng || null);
        setLocation(detectedCoords.name || '');
      } else if (locationMissing) {
        // This case should not happen with our new validation, but just in case
        setUploading(false);
        setError('Please select a location on the map');
        return;
      }
      
      // Create photo data using the current state
      const photoData = {
        title,
        imageUrl: finalImageUrl,
        location: location || null,
        latitude: detectedCoords?.lat || latitude,
        longitude: detectedCoords?.lng || longitude,
      };
      
      // Final check to ensure we have coordinates
      if (!photoData.latitude || !photoData.longitude) {
        console.error("Coordinates missing from photoData:", photoData);
        setError("Please select a location on the map");
        setUploading(false);
        return;
      }
      
      console.log("Submitting photo data:", photoData);
      
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
      
      toast.success('Photo uploaded successfully!');
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = "/map";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (shouldUseAI && preview && !isDetectingLocation) {
      // If we're using AI and have a preview but no coordinates yet,
      // we need to detect the location after upload
      if (!latitude || !longitude) {
        toast('Will attempt to detect location after upload');
      }
    }
  }, [shouldUseAI, preview, latitude, longitude, isDetectingLocation]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      // Reset location if file changes
      if (!shouldUseAI) {
        setLatitude(null);
        setLongitude(null);
        setLocation('');
      }
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
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
                    <input 
                      type="hidden" 
                      name="latitude" 
                      value={latitude?.toString() ?? ''} 
                    />
                    <input 
                      type="hidden" 
                      name="longitude" 
                      value={longitude?.toString() ?? ''} 
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo*
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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
              
              {/* Add explanatory text about automatic location detection */}
              <div className="mt-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {!latitude && !longitude ? (
                    <span>Location required - AI will attempt to detect it automatically or you can select it on the map</span>
                  ) : (
                    <span>Location selected: {location || `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`}</span>
                  )}
                </p>
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
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Don't know where this photo was taken?
                </p>
                <p className="text-xs text-yellow-700">
                  Our experimental AI can attempt to guess the location based on landmarks and features in your photo. 
                  Results may vary in accuracy and are not guaranteed to be correct.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!imageFile && !imageUrl) {
                      toast.error('Please select an image first');
                      return;
                    }
                    
                    // Set the flag to use AI
                    setShouldUseAI(true);
                    
                    if (imageFile) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        const base64Data = base64.split(',')[1];
                        
                        toast('Analyzing image with AI...');
                        setIsDetectingLocation(true);
                        
                        detectLocation(base64Data, true)
                          .then(result => {
                            if (result.success) {
                              toast.success('Location detected! Check the map to verify.');
                            } else {
                              toast.error('Could not identify location from this image.');
                            }
                          })
                          .catch(error => {
                            console.error("Error during detection:", error);
                            toast.error('Location detection failed');
                          });
                      };
                      reader.readAsDataURL(imageFile);
                    } else if (imageUrl) {
                      toast('Analyzing image with AI...');
                      setIsDetectingLocation(true);
                      
                      detectLocation(imageUrl)
                        .then(result => {
                          if (result.success) {
                            toast.success('Location detected! Check the map to verify.');
                          } else {
                            toast.error('Could not identify location from this image.');
                          }
                        })
                        .catch(error => {
                          console.error("Error during detection:", error);
                          toast.error('Location detection failed');
                        });
                    }
                  }}
                  disabled={isDetectingLocation || (!imageFile && !imageUrl)}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDetectingLocation ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      <span>AI Analyzing Image...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H9.834V9.593l1.553 1.553a.75.75 0 001.06-1.06l-3-3a.75.75 0 00-1.06 0l-3 3a.75.75 0 001.06 1.06l1.553-1.553V13h-1z" />
                      </svg>
                      <span>Use AI to Detect Location</span>
                    </>
                  )}
                </button>
              </div>
              
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