'use client';

import { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: 'Passionate traveler exploring the world one country at a time.',
    location: 'San Francisco, CA',
    photoCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-primary"></div>
          
          {/* Profile info */}
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row items-center">
              {/* Profile picture */}
              <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              {/* User info */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600">{profile.location}</p>
                <p className="mt-2">{profile.bio}</p>
                <div className="mt-4 flex justify-center md:justify-start space-x-4">
                  <div className="text-center">
                    <span className="block font-bold">{profile.photoCount}</span>
                    <span className="text-gray-600 text-sm">Photos</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">{profile.followersCount}</span>
                    <span className="text-gray-600 text-sm">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">{profile.followingCount}</span>
                    <span className="text-gray-600 text-sm">Following</span>
                  </div>
                </div>
              </div>
              
              {/* Edit profile button */}
              <div className="md:ml-auto mt-6 md:mt-0">
                <button className="btn-secondary">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photos Grid - Empty State */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Travel Photos</h2>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No photos yet</h3>
            <p className="mt-1 text-gray-500">Upload your first travel photo to start your journey!</p>
            <div className="mt-6">
              <button className="btn-primary">Upload Photo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 