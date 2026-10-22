import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import { seedProducts, initialSettings } from './seed.mjs';
mkdirSync(config.dataDir, { recursive: true, mode: 0o700 });
export const db = new DatabaseSync(path.join(config.dataDir, 'yellowcada.sqlite'));
try { chmodSync(path.join(config.dataDir,'yellowcada.sqlite'),0o600); } catch {}
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', description TEXT NOT NULL, colour TEXT NOT NULL, hex TEXT NOT NULL, style TEXT NOT NULL, image TEXT NOT NULL, spec TEXT NOT NULL, price_paisa INTEGER CHECK(price_paisa IS NULL OR price_paisa > 0), stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0), active INTEGER NOT NULL DEFAULT 1, approved INTEGER NOT NULL DEFAULT 0, sample INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY, csrf TEXT NOT NULL, admin_id INTEGER REFERENCES admins(id), expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, access_hash TEXT NOT NULL, session_id TEXT NOT NULL, kind TEXT NOT NULL, customer TEXT NOT NULL, items TEXT NOT NULL, subtotal INTEGER, shipping INTEGER, total INTEGER, payment_method TEXT, payment_status TEXT NOT NULL DEFAULT 'not_applicable', status TEXT NOT NULL DEFAULT 'received', notes TEXT NOT NULL DEFAULT '', idempotency_key TEXT UNIQUE NOT NULL, body_hash TEXT NOT NULL, response TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS order_events(id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL REFERENCES orders(id), status TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS replacements(id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'received', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY, session_id TEXT, order_id TEXT REFERENCES orders(id), mime TEXT NOT NULL, filename TEXT NOT NULL, purpose TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS outbox(id INTEGER PRIMARY KEY AUTOINCREMENT, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', provider_id TEXT, attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, next_attempt INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, action TEXT NOT NULL, entity TEXT NOT NULL, details TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS rate_windows(key TEXT PRIMARY KEY, count INTEGER NOT NULL, resets INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS mail_status ON outbox(status,next_attempt);
`);
if (!db.prepare('SELECT 1 FROM migrations WHERE version=1').get()) {
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const p of seedProducts) db.prepare('INSERT OR IGNORE INTO products(id,slug,sku,name,subtitle,description,colour,hex,style,image,spec,price_paisa,stock,active,approved,sample) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(p.id,p.slug,p.sku,p.name,p.subtitle,p.description,p.colour,p.hex,p.style,p.image,JSON.stringify(p.spec),p.price_paisa,p.stock,p.active,p.approved,p.sample);
    for (const [k,v] of Object.entries(initialSettings)) db.prepare('INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)').run(k,JSON.stringify(v));
    db.prepare('INSERT INTO migrations VALUES(1,?)').run(new Date().toISOString());
    db.exec('COMMIT');
  } catch(e) { db.exec('ROLLBACK'); throw e; }
}
export const getSettings = () => Object.fromEntries(db.prepare('SELECT key,value FROM settings').all().map(r=>[r.key,JSON.parse(r.value)]));
export const productFromRow = row => row ? {...row,spec:JSON.parse(row.spec)} : null;
export const listProducts = (all=false) => db.prepare(`SELECT * FROM products ${all?'':'WHERE active=1'} ORDER BY id`).all().map(productFromRow);
export const getProduct = id => productFromRow(db.prepare('SELECT * FROM products WHERE id=?').get(id));
export function audit(adminId,action,entity,details={}) { db.prepare('INSERT INTO audit(admin_id,action,entity,details) VALUES(?,?,?,?)').run(adminId,action,String(entity),JSON.stringify(details)); }
export function transaction(callback) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = callback(); db.exec('COMMIT'); return result; }
  catch(e) { db.exec('ROLLBACK'); throw e; }
}
