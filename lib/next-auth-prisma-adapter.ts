import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";

/**
 * Safely create a Prisma adapter that won't try to connect during build time
 */
export function createSafePrismaAdapter(prisma: PrismaClient): Adapter {
  // Check if we're in a build environment
  const isBuildTime = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'build';
  
  // If we're in build time, return a mock adapter that won't try to connect
  if (isBuildTime) {
    return {
      createUser: async () => ({ id: 'build-time-mock', email: '', emailVerified: null }),
      getUser: async () => null,
      getUserByEmail: async () => null,
      getUserByAccount: async () => null,
      updateUser: async (data: Record<string, unknown>) => data,
      linkAccount: async () => ({}),
      createSession: async () => ({}),
      getSessionAndUser: async () => null,
      updateSession: async () => ({}),
      deleteSession: async () => {},
      createVerificationToken: async () => ({}),
      useVerificationToken: async () => null,
    } as unknown as Adapter;
  }
  
  // Otherwise, return the normal PrismaAdapter
  return PrismaAdapter(prisma);
} 