import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { allRoutes, publicRoutes } from '../src/data/routes.js';
import { distDir, basePath, origin, staticHosting } from './seo-shared.mjs';

let failures = 0;
const targets = new Set();
function localTarget(url) {
  const parsed = new URL(url.replaceAll('&amp;', '&'), `${origin}/`);
  if (parsed.origin !== new URL(origin).origin) return null;
  if (!parsed.pathname.startsWith(basePath)) throw new Error(`URL escaped deployment base: ${url}`);
  const relative = decodeURIComponent(parsed.pathname.slice(basePath.length));
  return { pathname: `/${relative}`.replace(/\/$/, '') || '/', file: path.join(distDir, relative) };
}
for (const route of allRoutes) {
  const file = route === '/' ? path.join(distDir,'index.html') : path.join(distDir,route.slice(1),'index.html');
  const html = await readFile(file,'utf8');
  const required = ['<title', 'name="description"', 'rel="canonical"', 'property="og:title"', 'application/ld+json', '<h1', '<main', '<p', 'href='];
  const missing = required.filter(value => !html.includes(value));
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if (canonical !== `${origin}${route === '/shop' ? '/products' : route}`) missing.push(`correct canonical (${canonical})`);
  if ((html.match(/rel="canonical"/g) || []).length !== 1) missing.push('single canonical');
  if (publicRoutes.includes(route) && /content="noindex/.test(html)) missing.push('indexable public page');
  if (html.includes('/src/main.jsx') || html.includes('<!--app-html-->')) missing.push('compiled, prerendered entry');
  if (staticHosting && /action="\/api|<form\b/.test(html)) missing.push('static enquiry path');
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!schemas.length) missing.push('parseable JSON-LD');
  for (const [, source] of schemas) {
    try { JSON.parse(source); } catch { missing.push('valid JSON-LD'); }
  }
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  for (const tag of images) {
    if (!/\balt="[^"]*"/.test(tag)) missing.push('image alt text');
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/')) {
      try { const target = localTarget(src); if (target && !existsSync(target.file)) missing.push(`image asset ${src}`); }
      catch (error) { missing.push(error.message); }
    }
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) {
    let pathname;
    try { pathname = localTarget(href)?.pathname; } catch (error) { missing.push(error.message); continue; }
    if (!pathname) continue;
    if (!path.extname(pathname) && !allRoutes.includes(pathname) && pathname !== '/admin') missing.push(`internal link ${href}`);
  }
  for (const [, value] of html.matchAll(/\b(?:src|href|poster)="([^"#]+)"/g)) {
    if (!value.startsWith('/') && !value.startsWith(origin)) continue;
    try {
      const target = localTarget(value);
      if (!target) continue;
      const file = path.extname(target.pathname) ? target.file : path.join(target.file, 'index.html');
      targets.add(file);
      if (!existsSync(file)) missing.push(`local target ${value}`);
    } catch (error) { missing.push(error.message); }
  }
  if (missing.length) { console.error(`${route}: missing ${missing.join(', ')}`); failures++; }
  else console.log(`${route}: source HTML verified (${html.length} bytes)`);
}
for (const name of ['robots.txt', 'sitemap-index.xml', 'sitemap.xml', 'image-sitemap.xml', 'llms.txt', 'humans.txt', 'site.webmanifest', 'favicon.ico', 'favicon.svg', 'og-image.jpg', '404.html', '.nojekyll']) {
  if (!existsSync(path.join(distDir, name))) { console.error(`Missing ${name}`); failures++; }
}
for (const name of ['sitemap.xml', 'sitemap-index.xml', 'image-sitemap.xml']) {
  const xml = await readFile(path.join(distDir, name), 'utf8');
  for (const [, url] of xml.matchAll(/<(?:loc|image:loc)>(.*?)<\//g)) {
    if (!url.startsWith(`${origin}/`)) { console.error(`Wrong deployment URL in ${name}: ${url}`); failures++; }
    try {
      const target = localTarget(url);
      const file = path.extname(target.pathname) ? target.file : path.join(target.file, 'index.html');
      if (!existsSync(file)) { console.error(`Missing sitemap target ${url}`); failures++; }
    } catch (error) { console.error(error.message); failures++; }
  }
  if (name === 'image-sitemap.xml' && !xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) failures++;
}
const manifest = JSON.parse(await readFile(path.join(distDir, 'site.webmanifest'), 'utf8'));
if (manifest.start_url !== basePath || manifest.icons.some(icon => !existsSync(localTarget(icon.src).file))) failures++;
console.log(`Verified ${allRoutes.length} rendered routes and ${targets.size} unique local targets for ${origin}.`);
if (failures) process.exitCode = 1;
