'use client';

import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AnimatedHero() {
  const controls = useAnimation();
  const features = [
    {
      title: 'AI Location Detection',
      description: 'Automatically detect photo locations using advanced AI',
      icon: '🎯'
    },
    {
      title: 'Interactive Map',
      description: 'Visualize your journey on our global interactive map',
      icon: '🗺️'
    },
    {
      title: 'Connect & Share',
      description: 'Build connections with fellow travelers worldwide',
      icon: '🤝'
    },
    {
      title: 'Photo Memories',
      description: 'Create beautiful galleries of your adventures',
      icon: '📸'
    }
  ];

  useEffect(() => {
    const animate = async () => {
      await controls.start({
        x: [0, -280 * (features.length - 1)],
        transition: {
          duration: features.length * 3,
          ease: "linear",
          repeat: Infinity
        }
      });
    };

    animate();

    return () => {
      controls.stop();
    };
  }, [controls, features.length]);

  return (
    <div className="flex flex-col gap-8">
      {/* Mobile Feature Carousel - Only visible on mobile */}
      <motion.div 
        className="lg:hidden w-full overflow-hidden bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex gap-6 px-4"
          animate={controls}
        >
          {[...features, ...features].map((feature, index) => (
            <motion.div
              key={`${feature.title}-${index}`}
              className="flex-none w-[280px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index % features.length) }}
            >
              <div className="flex items-center gap-4 group">
                <div className="text-4xl transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column - Text Content */}
        <motion.div 
          className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Share Your Journey
            <span className="text-blue-400">.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Connect with travelers worldwide. Share your adventures, discover new places, 
            and create lasting memories on our interactive global platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold 
                hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </Link>
            <Link 
              href="/map" 
              className="bg-gray-800 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold 
                border-2 border-blue-400 hover:bg-gray-700 transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Explore Map
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Feature Cards - Only visible on desktop */}
        <motion.div 
          className="hidden lg:grid flex-1 grid-cols-2 gap-6 w-full max-w-xl lg:max-w-none mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all 
                border border-gray-700 hover:border-blue-500/50 group backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 