// This script is used to set environment variables for the build process
// It's executed by the postinstall script in package.json

const fs = require('fs');
const path = require('path');

// Check if we're in a Vercel build environment
const isVercelBuild = process.env.VERCEL_ENV === 'build';

if (isVercelBuild) {
  console.log('Running in Vercel build environment');
  
  // Create a temporary .env.local file with mock values for build time only
  const envPath = path.join(process.cwd(), '.env.local');
  
  const mockEnv = `
# THESE ARE MOCK VALUES USED ONLY DURING BUILD TIME
# REAL VALUES WILL BE USED AT RUNTIME FROM VERCEL ENV VARIABLES
NEXTAUTH_SECRET=mock-secret-for-build-only
NEXTAUTH_URL=https://example.com
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/globetrotter?schema=public
`;

  fs.writeFileSync(envPath, mockEnv);
  console.log('Created temporary .env.local file for build');
} else {
  console.log('Not in Vercel build environment, skipping env setup');
} 