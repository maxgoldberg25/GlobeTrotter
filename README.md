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

### Environment Variables

Required environment variables:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@hostname/database
PGHOST=hostname
PGUSER=user
PGPASSWORD=password
PGDATABASE=database

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Auth Configuration
NEXTAUTH_URL=your_production_url
NEXTAUTH_SECRET=your_secret
```

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

## Deployment on Vercel

The project is configured for deployment on Vercel with Neon PostgreSQL integration.

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Neon](https://neon.tech) account for the PostgreSQL database

### Steps to Deploy

1. **Fork or clone this repository** to your GitHub account

2. **Connect your repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your repository and click "Import"

3. **Set up Neon Integration**:
   - In Vercel, go to Storage
   - Add Neon integration
   - Connect to your project

4. **Configure Environment Variables**:
   Vercel will automatically set up database variables. Add the remaining variables:
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
   - `EMAIL_USER`: Your email address for the contact form
   - `EMAIL_PASSWORD`: Your email app password

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

## Technologies Used

- Next.js (version 13.4.19)
- TypeScript
- Tailwind CSS
- React
- Leaflet (for interactive maps)
- Prisma (ORM)
- NextAuth.js (authentication)
- Nodemailer (email functionality)
- Vercel (hosting platform)
- Neon (PostgreSQL database)
