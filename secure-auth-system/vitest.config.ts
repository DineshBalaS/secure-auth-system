// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "node", // We are testing backend logic, so 'node' is faster than 'jsdom'
    setupFiles: ["./vitest.setup.ts"], // Optional: for global env setup
  },
});
