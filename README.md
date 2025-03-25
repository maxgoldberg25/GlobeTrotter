# GlobeTrotter

GlobeTrotter is a social platform for travelers to share their photos and experiences from around the world. Users can upload photos with location data, view them on an interactive map, and connect with other travelers.

## Features

- **User Authentication**: Secure login and registration system
- **Photo Upload**: Share your travel photos with titles, descriptions, and location data
- **Interactive Map**: View all shared photos on a global map with location markers
  - Green pins show your own photos
  - Blue pins show other users' photos
- **Profile Management**: Customize your profile and view other users' galleries
- **Location Tracking**: Automatically capture or manually set photo locations
- **Social Features**: Follow other travelers and interact with their content

## Technologies Used

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Neon)
- **Authentication**: NextAuth.js
- **Map Integration**: Leaflet with React-Leaflet
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

## AI Location Detection Feature

The application now includes an experimental AI-powered location detection feature using the Picarta API. This feature can automatically analyze photos and suggest potential location coordinates based on landmarks and visual features in the image.

### Requirements

- **Image Format**: Only JPEG images are supported for AI location detection
- **API Key**: Requires a valid Picarta API key set in the environment variables
- **Image Quality**: Best results achieved with clear, outdoor photos containing recognizable landmarks

### How to Use

1. Upload a JPEG image or provide an image URL in the photo upload form
2. Click the "Use AI to Detect Location" button in the yellow information box
3. The AI will analyze the image and attempt to determine the location
4. If successful, the map will automatically update with the detected coordinates
5. You can verify and adjust the detected location on the map if needed

### Environment Setup

To use this feature, you must set the following environment variable:

## Live Demo

🌎 **Try GlobeTrotter**: [https://globe-trotter-sable.vercel.app/](https://globe-trotter-sable.vercel.app/)

Experience the live application and explore features like:
- Interactive world map with photo locations
- Photo uploads with geolocation
- User profiles and authentication
- Social connections with other travelers

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globetrotter.git
cd globetrotter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
DATABASE_URL="your_neon_db_url"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Live Demo

Visit the live application: [GlobeTrotter](https://globe-trotter-sable.vercel.app/)

## Features

- User authentication (registration/login)
- Profile management
- Photo upload with geolocation
- Interactive world map
- Social connectivity (friend/follow system)
- News feed
- Notifications
- Mobile-friendly responsive design
- Admin dashboard for user management
- Contact page with email functionality

## Database Setup

This project uses [Neon](https://neon.tech) for the PostgreSQL database, integrated with Vercel deployment.

### Database Tables
- User (authentication and user data)
- Account (OAuth connections)
- Session (active sessions)
- VerificationToken
- Photo
- Follow
- playing_with_neon

### Database Management
- **View Database**: Access through [Neon Console](https://console.neon.tech)
- **Local Development**: Use Prisma Studio
  ```bash
  npx prisma studio
  ```
  This opens a GUI at http://localhost:5555

### Email Functionality

To enable the contact form emails:

1. Set up the following environment variables in your `.env` file:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```
   
   For Gmail, you'll need to use an app password. See [Google Account Help](https://support.google.com/accounts/answer/185833) for instructions.
   
2. The contact form is pre-configured to send emails to `welliberg@gmail.com`.

### Admin Access

To set up the admin user:

1. Start the development server: `npm run dev`
2. Run the admin setup script: `node scripts/setup-admin.js`
3. Log in with the credentials:
   - Email: `test@gmail.com` 
   - Password: `Password`
4. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

### Continuous Deployment

This project is set up for continuous deployment. Any changes pushed to the main branch will automatically be deployed.

## MVP Development Progress

1. ✅ Set up project structure 
2. ✅ User authentication UI
3. ✅ Profile management UI
4. ✅ Interactive Map Integration with Leaflet
5. ✅ Photo upload & geolocation UI
6. ✅ Admin dashboard
7. ✅ Contact page with email functionality
8. ⬜ Social connectivity
9. ⬜ Notifications
10. ⬜ Mobile optimization

## Technologies & Tools

### Frontend
- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Map Library**: Leaflet & React-Leaflet
- **Form Handling**: React Hook Form
- **State Management**: React Hooks & Context
- **Toast Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database ORM**: Prisma
- **Email Service**: Nodemailer

### Database & Storage
- **Database**: PostgreSQL (via Neon)
- **Image Storage**: Cloudinary
- **Caching**: Next.js built-in caching

### Development Tools
- **Version Control**: Git & GitHub
- **IDE**: Visual Studio Code
- **API Testing**: Postman
- **Database Management**: Prisma Studio

### Deployment & Infrastructure
- **Hosting**: Vercel
- **Database Hosting**: Neon
- **CI/CD**: Vercel's GitHub Integration
- **Environment Variables**: Vercel & .env.local

## Recent Bug Fixes

### Map Location Selection

We've resolved an issue where manually selecting a location on the map wasn't properly recognized during form submission. The fix addresses:

- Correctly handling zero-value coordinates (like longitude 0° at Greenwich)
- Ensuring manual map selections take precedence over AI detection
- Preventing the "Please select a location on the map" error when coordinates are already set

### Image Size Optimization

The application now automatically optimizes images to prevent payload size issues:

- Large images are automatically resized before uploading to the server
- Images for AI location detection are compressed to ensure compatibility with API limits
- Original image quality is preserved for viewing while optimizing for server requirements

These fixes improve reliability when uploading photos with both manual map selections and AI-detected locations.
