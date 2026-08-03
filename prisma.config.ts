// prisma.config.ts
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  migrations: {
    seed: 'npx ts-node --compiler-options {"module":"CommonJS"} ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});