/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove standalone output for Vercel - it handles this automatically
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
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Environment variables that should be available on the client
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
