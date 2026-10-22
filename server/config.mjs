import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
try {
  for (const line of readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
export const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3000),
  origin: new URL(process.env.APP_URL || 'http://localhost:3000').origin,
  production: process.env.NODE_ENV === 'production',
  trustProxy: process.env.TRUST_PROXY === 'true',
  dataDir: path.resolve(ROOT, process.env.DATA_DIR || 'data'),
  maxBody: Math.min(Number(process.env.BODY_LIMIT_BYTES || 5242880), 10485760),
  sessionHours: Number(process.env.SESSION_HOURS || 12),
};
if (config.production && !config.origin.startsWith('https://')) throw new Error('Production requires an HTTPS APP_URL.');
if (!Number.isInteger(config.port) || config.port < 0 || config.port > 65535) throw new Error('Invalid PORT.');
