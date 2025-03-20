'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                GlobeTrotter
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/map" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Explore Map
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/upload" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Upload Photos
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/map" className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Explore Map
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/upload" className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                  Upload Photos
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 