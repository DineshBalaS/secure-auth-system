// 
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // This handles the connection for 'npx prisma migrate' and 'generate'
    url: env("DATABASE_URL"),
  },
});