import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { allRoutes } from '../src/data/routes.js';
import { origin } from './seo-shared.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(path.join(root, '.ssr', 'entry-server.js')).href);

for (const route of allRoutes) {
  const { html, head } = render(route);
  const document = template.replace('</head>', `${head}\n</head>`).replace('<!--app-html-->', html);
  const target = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, document, 'utf8');
  if (route === '/404') await writeFile(path.join(dist, '404.html'), document, 'utf8');
  if (!document.includes('<h1') || !document.includes('application/ld+json')) throw new Error(`Prerender incomplete for ${route}`);
  console.log(`Prerendered ${route}`);
}
for (const [alias, destination] of Object.entries({ '/services': '/about#craft', '/compare': '/products', '/search': '/' })) {
  const url = `${origin}${destination}`;
  const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Continue to YellowCada</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${url}"><meta http-equiv="refresh" content="0;url=${url}"></head><body><h1>Continue to YellowCada</h1><p><a href="${url}">Explore the requested page</a>.</p></body></html>`;
  const target = path.join(dist, alias.slice(1), 'index.html');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, document);
}
await writeFile(path.join(dist, '.nojekyll'), '');
