/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@dream-team/backend', '@dream-team/shared'],
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
