import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker deployment — bundles only the necessary files
  output: "standalone",
};

export default nextConfig;
