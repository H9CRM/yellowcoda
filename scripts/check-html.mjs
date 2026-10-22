import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { allRoutes } from '../src/data/routes.js';
import { distDir } from './seo-shared.mjs';

let failures = 0;
for (const route of allRoutes) {
  const file = route === '/' ? path.join(distDir,'index.html') : path.join(distDir,route.slice(1),'index.html');
  const html = await readFile(file,'utf8');
  const required = ['<title', 'name="description"', 'rel="canonical"', 'property="og:title"', 'application/ld+json', '<h1', '<main', '<p', 'href='];
  const missing = required.filter(value => !html.includes(value));
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!schemas.length) missing.push('parseable JSON-LD');
  for (const [, source] of schemas) {
    try { JSON.parse(source); } catch { missing.push('valid JSON-LD'); }
  }
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  for (const tag of images) {
    if (!/\balt="[^"]*"/.test(tag)) missing.push('image alt text');
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/') && !existsSync(path.join(distDir, src.split('?')[0]))) missing.push(`image asset ${src}`);
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) {
    const pathname = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (!path.extname(pathname) && !allRoutes.includes(pathname) && pathname !== '/admin') missing.push(`internal link ${href}`);
  }
  if (missing.length) { console.error(`${route}: missing ${missing.join(', ')}`); failures++; }
  else console.log(`${route}: source HTML verified (${html.length} bytes)`);
}
if (failures) process.exitCode = 1;
