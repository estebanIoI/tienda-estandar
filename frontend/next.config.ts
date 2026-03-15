import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // necesario para el Dockerfile de producción
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
