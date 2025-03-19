'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PhotoUploader component with no SSR
// This is necessary because it uses Leaflet which requires window
const PhotoUploader = dynamic(
  () => import('../components/PhotoUploader'),
  { ssr: false }
);

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Your Travel Photos</h1>
        <p className="text-gray-600 mb-8">
          Share your adventures with the GlobeTrotter community. Upload photos, tag their locations, and add details about your experiences.
        </p>
        
        <PhotoUploader />
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Photo Guidelines</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>High-quality images that showcase the location</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Accurate location tagging for proper map display</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Descriptive titles and captions that tell the story</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Respect copyright and privacy when sharing photos</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 