# GlobeTrotter

A social platform for travelers to share their journey with the world. Upload photos, geotag them on an interactive map, and connect with fellow travelers.

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

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Admin Access

To set up the admin user:

1. Start the development server: `npm run dev`
2. Run the admin setup script: `node scripts/setup-admin.js`
3. Log in with the credentials:
   - Email: `test@gmail.com` 
   - Password: `Password`
4. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

## Deployment on Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A PostgreSQL database (e.g., [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech))

### Steps to Deploy

1. **Fork or clone this repository** to your GitHub account

2. **Connect your repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your repository and click "Import"

3. **Configure Environment Variables**:
   In the Vercel project settings, add the following environment variables:
   
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
   
   Optional (for social login):
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET`

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   
5. **Run Database Migrations**:
   After deployment, you need to run the database migrations:
   
   ```bash
   # Install Vercel CLI if you haven't already
   npm i -g vercel
   
   # Log in to Vercel
   vercel login
   
   # Run migrations on the production database
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Continuous Deployment

This project is set up for continuous deployment. Any changes pushed to the main branch will automatically be deployed.

## MVP Development Progress

1. ✅ Set up project structure 
2. ✅ User authentication UI
3. ✅ Profile management UI
4. ✅ Interactive Map Integration with Leaflet
5. ✅ Photo upload & geolocation UI
6. ✅ Admin dashboard
7. ⬜ Social connectivity
8. ⬜ Notifications
9. ⬜ Mobile optimization

## Technologies Used

- Next.js (version 13.4.19)
- TypeScript
- Tailwind CSS
- React
- Leaflet (for interactive maps)
- Prisma (ORM)
- NextAuth.js (authentication)
- Vercel (hosting platform)
