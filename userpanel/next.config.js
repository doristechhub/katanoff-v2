/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    enabled: true,
  },

  reactStrictMode: false,
};

module.exports = nextConfig;
