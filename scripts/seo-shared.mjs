import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const publicDir = path.join(root, 'public');
export const distDir = path.join(root, 'dist');
const env = loadEnv('production', root, 'VITE_');
export const origin = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const basePath = `${new URL(origin).pathname.replace(/\/$/, '')}/`;
export const staticHosting = (process.env.VITE_STATIC_HOSTING || env.VITE_STATIC_HOSTING) === 'true';
export const escapeXml = text => String(text).replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' })[c]);
export async function savePublic(name, content) {
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, name), content, 'utf8');
  try { await writeFile(path.join(distDir, name), content, 'utf8'); } catch { /* Run before first build. */ }
}
