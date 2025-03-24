"use client";

import Link from 'next/link';

export default function BackToDashboard() {
  return (
    <div className="mb-6">
      <Link 
        href="/dashboard" 
        onClick={() => window.location.href = '/dashboard'}
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Dashboard
      </Link>
    </div>
  );
} 