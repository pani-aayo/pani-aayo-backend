import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seeds/seed.ts',
  },
  datasource: {
    url: process.env.PRISMA_DATABASE_URL,
  },
});
