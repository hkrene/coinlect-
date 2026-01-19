import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Prevent creating multiple instances in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Initialize Prisma Client with Accelerate extension
export const prisma =
  globalForPrisma.prisma ??
  (new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }).$extends(withAccelerate()) as unknown as PrismaClient);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
