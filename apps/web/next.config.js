/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@land-intelligence/domain',
    '@land-intelligence/integrations',
    '@land-intelligence/ui',
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
