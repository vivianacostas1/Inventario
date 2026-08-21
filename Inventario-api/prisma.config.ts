import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx src/seed.ts", // O la ruta donde tengas tu archivo seed
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});