/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'yourdomain.com', 'placehold.it', 'res.cloudinary.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader'
    });

    // Don't attempt to bundle certain packages on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "mock-aws-s3": false,
        "aws-sdk": false,
        "bcrypt": false,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Exclude the problematic module from processing
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html$/,
      use: 'ignore-loader'
    });
    
    return config;
  },
};

module.exports = nextConfig; 