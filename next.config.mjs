/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone' removed - not needed for Nixpacks deployment
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during production builds
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript errors during production builds
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
