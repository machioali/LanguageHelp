/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove standalone output for Vercel - it handles this automatically
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Font optimization settings
  optimizeFonts: false, // Disable font optimization to avoid network issues
  // OR try enabling with more lenient settings
  // optimizeFonts: true,
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
  // Skip static optimization for routes that use headers/cookies
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
