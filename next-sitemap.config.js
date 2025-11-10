/** @type {import('next-sitemap').IConfig} */
const siteUrl = (process.env.SITEMAP_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    const loc = path.startsWith('http') ? path : `${siteUrl}${path}`;
    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const extraRoutes = ['/process'];
    return extraRoutes.map((route) => config.transform(config, route));
  },
};
