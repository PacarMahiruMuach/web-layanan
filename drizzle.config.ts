import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Memaksa Drizzle untuk menggunakan link Supabase
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
});