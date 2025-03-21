import { PrismaClient } from '@prisma/client';

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// PrismaClient is attached to the `global` object in development to prevent.
// exhausting your database connection limit
export const prisma = 
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Disabling this during build to prevent build errors
    // Only connect to the database when running in a non-build environment
    ...(process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'build' 
        ? { datasources: { db: { url: process.env.DATABASE_URL } } }
        : {})
  });

// If we're not in production, attach to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 