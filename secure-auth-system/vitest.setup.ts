// vitest.setup.ts
import { config } from "dotenv";

// Load .env file (or set defaults for testing if file is missing)
config();

// Fallback for CI/CD or if .env is missing locally
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "super_secret_testing_key_must_be_32_bytes_long!!";
}
