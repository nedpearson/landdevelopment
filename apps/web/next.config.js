/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@land-intelligence/domain',
    '@land-intelligence/integrations',
    '@land-intelligence/ui',
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
