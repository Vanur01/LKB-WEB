import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', '192.168.29.121'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.29.121',
        port: '9001',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
