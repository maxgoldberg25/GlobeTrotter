import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-10">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GlobeTrotter</h3>
            <p className="text-gray-600 text-sm">
              Share your travel journey with the world. Upload photos, tag locations, and connect with fellow travelers.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="text-gray-600 hover:text-primary">
                  World Map
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Featured Journeys
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Popular Destinations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signin" className="text-gray-600 hover:text-primary">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-600 hover:text-primary">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 