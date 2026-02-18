import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
const nextConfig: NextConfig = {
  // React strict mode (still valid)
  reactStrictMode: true,
  
  // swcMinify is now enabled by default - remove the option
  
  // Update images configuration - domains is deprecated
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Turbopack configuration (valid top-level option)
  turbopack: {
    // Turbopack options here if needed
    resolveAlias: {
      // Add any aliases here
    },
  },
  
  // Experimental features - only include what's actually used
  experimental: {
    // optimizeCss is still valid but may be in preview
    optimizeCss: false,
  },
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  
  // Add output configuration if needed
  output: 'standalone',
}

export default nextConfig
