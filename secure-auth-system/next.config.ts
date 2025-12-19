import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... other config options

  // Allow specific IPs for dev server
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.56.1:3000",
    "192.168.56.1",
    "192.168.0.109:3000",
    "192.168.0.109",
  ],
};

export default nextConfig;
