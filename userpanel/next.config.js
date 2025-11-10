/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Add Critters for critical CSS inlining (install: npm i --save-dev critters)
const Critters = require("critters");

module.exports = withBundleAnalyzer({
  // Enable SWC minification for smaller CSS/JS bundles (default: true, but explicit for clarity)
  swcMinify: true,

  // Your existing images config
  images: {
    unoptimized: true,
  },

  // Your existing Turbopack (stays enabled)
  experimental: {
    turbopack: true, // Note: Moved under 'experimental' for Next.js 14+ compatibility; adjust if using older version
  },

  // Your existing React Strict Mode
  reactStrictMode: false,

  // Critters webpack plugin: Inlines critical CSS, reduces render-blocking
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Only in production, client-side builds
      config.plugins.push(
        new Critters({
          // Inline critical styles; defer the rest
          preload: "swap", // Preload with 'swap' for smooth font/image handling
          pruneSource: true, // Remove unused CSS
          reduceInlineStyles: true, // Minify inlined CSS
          // Optional: Target specific entry if needed (e.g., for your globals.css)
          // entries: ["main"],
        })
      );
    }
    return config;
  },
});
