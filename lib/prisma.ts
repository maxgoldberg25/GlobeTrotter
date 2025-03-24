import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Add explicit type casting for decimal fields
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === 'Photo' && result) {
    return {
      ...result,
      latitude: result.latitude !== null ? Number(result.latitude) : null,
      longitude: result.longitude !== null ? Number(result.longitude) : null,
    };
  }
  return result;
});

export { prisma }; 