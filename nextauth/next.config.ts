import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "jsonwebtoken"],
};

export default nextConfig;