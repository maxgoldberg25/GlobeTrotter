/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'unpkg.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 