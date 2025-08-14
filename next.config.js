/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  async redirects() {
    return [
      {
        source: '/dashboard/interpreter/:path*',
        destination: '/interpreter-portal/interpreter/:path*',
        permanent: true,
      },
    ];
  },
  // Simplified webpack configuration for Vercel compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Environment variables for client-side
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
