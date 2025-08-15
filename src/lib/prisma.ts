import { PrismaClient } from '@prisma/client';

// Augment global namespace for Prisma singleton
declare global {
  var __prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a function to create a fresh Prisma client
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? [] : ['error'], // Reduced logging
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    errorFormat: 'minimal',
  });
}

// Create Prisma client with connection management
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Utility function to handle prepared statement conflicts
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a prepared statement conflict
      if (error.code === '42P05' || error.message?.includes('prepared statement')) {
        console.warn(`Retry ${attempt}/${maxRetries} for prepared statement conflict`);
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        
        // If it's the last attempt, disconnect and reconnect
        if (attempt === maxRetries) {
          try {
            await prisma.$disconnect();
            await prisma.$connect();
          } catch (reconnectError) {
            console.warn('Failed to reconnect:', reconnectError);
          }
        }
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
