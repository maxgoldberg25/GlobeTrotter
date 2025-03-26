import Image from 'next/image';
import AnimatedHero from './components/AnimatedHero';
import Testimonials from './components/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 pt-32">
        <div className="py-16">
          <AnimatedHero />
        </div>
        <div className="mt-32">
          <Testimonials />
        </div>
      </div>
    </main>
  );
} 