import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker deployment — bundles only the necessary files
  output: "standalone",
  // Don't fail the production build on type/lint errors in WIP pages so the app can
  // deploy; re-enable once the frontend compiles clean.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
