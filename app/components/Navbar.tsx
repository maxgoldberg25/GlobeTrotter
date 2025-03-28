'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSignOut } from "../lib/auth";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const handleSignOutAction = useSignOut();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Close menus when pathname changes (navigation)
  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Track scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close menus if the click is not on a menu item or toggle button
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu-toggle]') && !target.closest('[data-menu-content]')) {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle mobile menu toggle
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle user menu toggle
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close any open menus first
    setIsMenuOpen(false);
    setUserMenuOpen(false);
    
    // Set signing out state
    setIsSigningOut(true);
    
    try {
      // Sign out using our enhanced hook
      await handleSignOutAction();
      // Force a refresh of the page to ensure state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isHomePage = pathname === "/";
  
  // Check if current path is login or signup to avoid showing these buttons on those pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';
  
  // Check if current page is a dark page
  const isDarkPage = pathname === '/' || pathname === '/map' || pathname === '/photos/upload' || pathname === '/contact';
  
  return (
    <nav
      className={`fixed w-full transition-all duration-300 pointer-events-auto ${
        scrolled || !isDarkPage
          ? "bg-gray-800 shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image
              src="/images/logo.svg"
              alt="GlobeTrotter Logo"
              fill
              className="object-contain"
            />
          </div>
          <span
            className={`font-bold text-xl ${
              scrolled || !isDarkPage ? "text-white" : "text-white"
            }`}
          >
            GlobeTrotter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/map"
            className={`${
              scrolled || !isDarkPage ? "text-gray-300" : "text-white"
            } hover:text-blue-400 transition-colors font-medium`}
          >
            Explore Map
          </Link>
          {status === "authenticated" && (
            <>
              <Link
                href="/photos/upload"
                className={`${
                  scrolled || !isDarkPage ? "text-gray-300" : "text-white"
                } hover:text-blue-400 transition-colors font-medium`}
              >
                Upload Photos
              </Link>
              <Link
                href="/dashboard"
                className={`${
                  scrolled || !isDarkPage ? "text-gray-300" : "text-white"
                } hover:text-blue-400 transition-colors font-medium`}
              >
                My Profile
              </Link>
              
              {/* Admin link only visible for admin user */}
              {session?.user?.email === 'test@gmail.com' && (
                <Link
                  href="/admin"
                  className={`${
                    scrolled || !isDarkPage ? "text-gray-300" : "text-white"
                  } hover:text-blue-400 transition-colors font-medium`}
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
          <Link
            href="/contact"
            className={`${
              scrolled || !isDarkPage ? "text-gray-300" : "text-white"
            } hover:text-blue-400 transition-colors font-medium`}
          >
            Contact
          </Link>

          {/* Auth Buttons or User Menu */}
          {status === "loading" ? (
            <div className="h-10 w-20 bg-gray-700 animate-pulse rounded"></div>
          ) : status === "authenticated" ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 focus:outline-none"
                data-menu-toggle="user"
              >
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-300">
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    userMenuOpen ? "transform rotate-180" : ""
                  } ${scrolled || !isDarkPage ? "text-gray-300" : "text-white"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700" data-menu-content="user">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  
                  {/* Admin link in dropdown for admin user */}
                  {session?.user?.email === 'test@gmail.com' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing out...
                      </span>
                    ) : (
                      "Sign out"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                href="/login"
                className={`px-4 py-2 rounded-md ${
                  scrolled || !isDarkPage
                    ? "text-gray-300 border border-gray-600 hover:bg-gray-700"
                    : "text-white border border-white hover:bg-white hover:text-gray-900"
                } transition-colors`}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          data-menu-toggle="mobile"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              scrolled || !isDarkPage ? "text-gray-300" : "text-white"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg py-2 px-4 border-t border-gray-700" data-menu-content="mobile">
          <div className="flex flex-col space-y-3">
            <Link
              href="/map"
              className="text-gray-300 hover:text-blue-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Map
            </Link>
            {status === "authenticated" && (
              <>
                <Link
                  href="/photos/upload"
                  className="text-gray-300 hover:text-blue-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload Photo
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-blue-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
            <Link
              href="/contact"
              className="text-gray-300 hover:text-blue-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {status === "loading" ? (
              <div className="h-10 w-20 bg-gray-700 animate-pulse rounded"></div>
            ) : status === "authenticated" ? (
              <>
                <div className="py-2 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">
                          {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="text-gray-300 hover:text-blue-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleSignOut(e);
                  }}
                  className="text-left text-gray-300 hover:text-blue-400 py-2"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing out...
                    </span>
                  ) : (
                    "Sign out"
                  )}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-center text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 