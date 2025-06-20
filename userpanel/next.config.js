/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    experimental: {
        turbo: true,
    },
    reactStrictMode: false,
};

module.exports = nextConfig