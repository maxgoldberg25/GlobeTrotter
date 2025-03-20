"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageContainer from "../components/PageContainer";

interface Photo {
  id: number | string;
  title: string;
  location: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      // Don't redirect - we'll show the "User not found" message instead
    }

    if (status === "authenticated" && session?.user) {
      // Fetch user photos
      // This would be replaced with an actual API call in production
      setUserPhotos([
        {
          id: 1,
          title: "Eiffel Tower",
          location: "Paris, France",
          imageUrl: "/images/map/eiffel.jpg",
          latitude: 48.8584,
          longitude: 2.2945,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Venice Canals",
          location: "Venice, Italy",
          imageUrl: "/images/map/venice.jpg",
          latitude: 45.4408,
          longitude: 12.3155,
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show user not found message
  if (status === "unauthenticated") {
    return (
      <PageContainer>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link 
            href="/login" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Log In
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 md:mb-0 md:mr-6 flex items-center justify-center overflow-hidden relative">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{session?.user?.name || "User"}</h1>
            <p className="text-gray-600">{session?.user?.email}</p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => alert("Edit profile functionality would go here")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">My Travel Photos</h2>
      
      {userPhotos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You haven't uploaded any photos yet.</p>
          <Link 
            href="/upload" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload Your First Photo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{photo.title}</h3>
                <p className="text-gray-600">{photo.location}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/map?lat=${photo.latitude}&lng=${photo.longitude}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View on Map
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
} 