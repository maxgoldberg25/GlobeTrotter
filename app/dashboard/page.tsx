'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [userName, setUserName] = useState('Traveler');
  
  // In a real app, you would fetch user data here
  useEffect(() => {
    // Simulating loading user data
    const timer = setTimeout(() => {
      setUserName('John Doe');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-600 mt-2">Your adventure dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Photos</h2>
          <p className="text-gray-600 mb-4">You haven't uploaded any photos yet.</p>
          <button className="btn-primary">Upload Your First Photo</button>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Explore Map</h2>
          <p className="text-gray-600 mb-4">Discover places you've been and places to go.</p>
          <Link href="/map">
            <button className="btn-secondary">View Map</button>
          </Link>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Connect</h2>
          <p className="text-gray-600 mb-4">Find friends and fellow travelers to follow.</p>
          <button className="btn-primary">Find Friends</button>
        </div>
      </div>
    </div>
  );
} 