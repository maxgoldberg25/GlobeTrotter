import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Share Your Journey With The World
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Upload photos, pin them on a map, and connect with fellow travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="block">
                <button className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 px-8 py-3 rounded-md text-lg font-medium transition-colors">
                  Get Started
                </button>
              </Link>
              <Link href="/map" className="block">
                <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md text-lg font-medium transition-colors">
                  Explore Map
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why GlobeTrotter?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The perfect platform for travelers who want to share their experiences and connect with others
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l1.9-5.7a8.38 8.38 0 113.4 2.9 8.5 8.5 0 01-3.4-.69L3 21" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-600">
              Pin your travel photos on a world map and explore where others have been
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Photo Sharing</h3>
            <p className="text-gray-600">
              Upload your travel photos with location tags and engaging descriptions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V12H5.698A8 8 0 0114.031 3.113M12 4.354V3m0 9h6.3A8 8 0 0112 21a8 8 0 01-8-8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Connectivity</h3>
            <p className="text-gray-600">
              Follow friends, like photos, and see updates in your personalized feed
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials/Social Proof */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Destinations</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover amazing places shared by our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Venice Canals"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Venice, Italy</h3>
                <p className="text-gray-700 mt-2">A magical city built on water with historic canals and architecture.</p>
                <div className="mt-4">
                  <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                    742 photos
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1546412414-e1885e51148b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Kyoto Temple"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Kyoto, Japan</h3>
                <p className="text-gray-700 mt-2">Experience the perfect blend of traditional culture and serene natural beauty.</p>
                <div className="mt-4">
                  <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                    531 photos
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1525874684015-58379d421a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Santorini"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Santorini, Greece</h3>
                <p className="text-gray-700 mt-2">Stunning white buildings with blue domes overlooking the Aegean Sea.</p>
                <div className="mt-4">
                  <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                    895 photos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to share your adventures?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers documenting their journeys around the world.
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-primary hover:bg-blue-50 px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Create Your Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 