import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'node -r tsx/cjs src/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});