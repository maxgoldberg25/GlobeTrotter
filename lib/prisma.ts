import { PrismaClient } from '@prisma/client';

// This prevents multiple instances of Prisma Client in development.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit
export const prisma = globalForPrisma.prisma || new PrismaClient();

// If we're not in production, attach to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 