import { publicRoutes } from '../src/data/routes.js';
import { origin, escapeXml, savePublic } from './seo-shared.mjs';

const today = new Date().toISOString().slice(0,10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map(route => `  <url><loc>${escapeXml(origin + route)}</loc><lastmod>${today}</lastmod><changefreq>${route === '/' || route === '/products' ? 'weekly' : 'monthly'}</changefreq><priority>${route === '/' ? '1.00' : route === '/products' ? '0.90' : '0.70'}</priority></url>`).join('\n')}\n</urlset>\n`;
const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${escapeXml(origin)}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>\n  <sitemap><loc>${escapeXml(origin)}/image-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>\n</sitemapindex>\n`;
await savePublic('sitemap.xml', xml);
await savePublic('sitemap-index.xml', index);
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /media/private/\nDisallow: /private/\nDisallow: /test/\nDisallow: /staging/\nDisallow: /drafts/\nDisallow: /checkout\nDisallow: /cart\n\nSitemap: ${origin}/sitemap-index.xml\nSitemap: ${origin}/sitemap.xml\nSitemap: ${origin}/image-sitemap.xml\n`;
await savePublic('robots.txt', robots);
console.log(`Generated sitemaps and robots.txt for ${origin}`);
