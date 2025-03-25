'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnimatedHero() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left Column - Text Content */}
      <motion.div 
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Share Your Journey
          <span className="text-blue-400">.</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-8"
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
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold 
              hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link 
            href="/map" 
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold 
              border-2 border-blue-400 hover:bg-gray-700 transition-all"
          >
            Explore Map
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Column - Feature Cards */}
      <motion.div 
        className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
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
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 