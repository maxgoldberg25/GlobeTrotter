import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Globe Video Background */}
      <div className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-rotating-globe-in-3d-animation-9047-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-primary/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              Share Your Journey With The World
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow">
              Upload photos, pin them on a map, and connect with fellow travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="block">
                <button className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 px-8 py-3 rounded-md text-lg font-medium transition-colors transform hover:scale-105 duration-200">
                  Get Started
                </button>
              </Link>
              <Link href="/map" className="block">
                <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md text-lg font-medium transition-colors transform hover:scale-105 duration-200">
                  Explore Map
                </button>
              </Link>
            </div>
          </div>
          
          {/* Animated scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section with subtle animations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why GlobeTrotter?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The perfect platform for travelers who want to share their experiences and connect with others
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
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

          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
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

          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
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

      {/* Testimonials/Social Proof with image hover effects */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Destinations</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover amazing places shared by our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src="/images/destinations/venice.jpg" 
                  alt="Venice Canals"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src="/images/destinations/kyoto.jpg" 
                  alt="Kyoto Temple"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src="/images/destinations/santorini.jpg" 
                  alt="Santorini"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
      
      {/* CTA Section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to share your adventures?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers documenting their journeys around the world.
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-primary hover:bg-blue-50 px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
              Create Your Account
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <Link href="/contact" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Help
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-primary font-medium transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 