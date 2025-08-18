/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://www.katanoff.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // changefreq: "daily",
  // priority: 0.7,
  generateIndexSitemap: false,
  outDir: "./src/app",

  // Assign different priorities for different paths
  transform: async (config, path) => {
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
