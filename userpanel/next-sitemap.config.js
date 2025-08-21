/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://www.katanoff.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // changefreq: "daily",
  // priority: 0.7,
  generateIndexSitemap: false,
  outDir: "./src/app",

  // Exclude all non-page routes (icons, manifests, images, api, etc.)
  exclude: [
    "/opengraph-image*",
    "/icon*",
    "/manifest*",
    "/robots.txt",
    "/sitemap.xml",
    "/api/*",
  ],

  transform: async (config, path) => {
    // Skip any non-page routes explicitly
    if (
      path.includes(".png") ||
      path.includes(".jpg") ||
      path.includes(".svg") ||
      path.startsWith("/api") ||
      path.startsWith("/_next")
    ) {
      return null; // <- will not include in sitemap
    }

    let priority = 0.8;

    if (path === "/") {
      priority = 1.0;
    }

    return {
      loc: path,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
