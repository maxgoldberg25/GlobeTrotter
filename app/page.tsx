import Image from 'next/image';
import AnimatedHero from './components/AnimatedHero';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <Image
            src="/world-pattern.svg"
            alt="World Pattern"
            fill
            className="object-cover"
          />
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <AnimatedHero />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800 text-white py-16 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Photos Shared' },
              { number: '100+', label: 'Countries' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 