import { randomBytes, createHash, scrypt as rawScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from './db.mjs';
import { config } from './config.mjs';
const scrypt = promisify(rawScrypt);
export const randomToken = () => randomBytes(32).toString('hex');
export const sha256 = s => createHash('sha256').update(String(s)).digest('hex');
export class HttpError extends Error { constructor(status,message) { super(message); this.status=status; } }
export const assert = (condition,message,status=400) => { if (!condition) throw new HttpError(status,message); };
export function securityHeaders(res, nonce) {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy','same-origin');
  res.setHeader('Content-Security-Policy',`default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`);
  if(config.production) res.setHeader('Strict-Transport-Security','max-age=31536000');
}
function cookie(req) { const m = (req.headers.cookie||'').match(/(?:^|;\s*)yc_session=([a-f0-9]{64})(?:;|$)/); return m?.[1]; }
function setCookie(res,raw) {res.setHeader('Set-Cookie',`yc_session=${raw}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${config.sessionHours*3600}${config.production?'; Secure':''}`);}
export function getSession(req,res,create=true) {
  const raw = cookie(req);
  let session = raw ? db.prepare('SELECT * FROM sessions WHERE id=? AND expires_at>?').get(sha256(raw),Date.now()) : null;
  if(!session && create) {
    const token=randomToken(); session={id:sha256(token),csrf:randomToken(),admin_id:null,expires_at:Date.now()+config.sessionHours*3600000,created_at:Date.now()};
    db.prepare('INSERT INTO sessions(id,csrf,admin_id,expires_at,created_at) VALUES(?,?,?,?,?)').run(session.id,session.csrf,null,session.expires_at,session.created_at); setCookie(res,token);
  }
  return session;
}
export function rotateSession(req,res,old,adminId=null) {
  db.prepare('DELETE FROM sessions WHERE id=?').run(old.id);
  const raw=randomToken(), session={id:sha256(raw),csrf:randomToken(),admin_id:adminId,expires_at:Date.now()+config.sessionHours*3600000,created_at:Date.now()};
  db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(session.id,session.csrf,adminId,session.expires_at,session.created_at); setCookie(res,raw); return session;
}
export function csrfCheck(req,session) {
  assert(session,'Your session expired. Reload this page.',403);
  const origin=req.headers.origin;
  assert(!origin || origin===config.origin,'Cross-origin request rejected.',403);
  assert(req.headers['sec-fetch-site']!=='cross-site','Cross-site request rejected.',403);
  const submitted=req.headers['x-csrf-token'];
  assert(typeof submitted==='string' && /^[a-f0-9]{64}$/.test(submitted) && timingSafeEqual(Buffer.from(submitted),Buffer.from(session.csrf)),'Your security token expired. Reload and try again.',403);
}
export function rateLimit(req,bucket,max=60,ms=60000) {
  const ip=config.trustProxy ? String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',').at(-1).trim() : req.socket.remoteAddress;
  const key=sha256(`${bucket}|${ip}`), now=Date.now();
  let r=db.prepare('SELECT * FROM rate_windows WHERE key=?').get(key);
  if(!r || r.resets<now) {db.prepare('INSERT OR REPLACE INTO rate_windows(key,count,resets) VALUES(?,1,?)').run(key,now+ms);return;}
  assert(r.count<max,'Too many requests. Please try again later.',429);
  db.prepare('UPDATE rate_windows SET count=count+1 WHERE key=?').run(key);
}
export async function passwordHash(password) {
  assert(typeof password==='string' && password.length>=14 && password.length<=256,'Use a password between 14 and 256 characters.');
  const salt=randomBytes(16).toString('hex');
  const key=await scrypt(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024});
  return `${salt}:${key.toString('hex')}`;
}
export async function passwordCheck(password,stored) {
  if(typeof password!=='string'||password.length>256) return false;
  const [salt,hash]=stored.split(':');
  const key=await scrypt(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024});
  return timingSafeEqual(key,Buffer.from(hash,'hex'));
}
export async function readBody(req,limit=config.maxBody) {
  const chunks=[]; let size=0;
  for await(const chunk of req) {size+=chunk.length; assert(size<=limit,'The upload or request is too large.',413); chunks.push(chunk);}
  return Buffer.concat(chunks);
}
export async function readJson(req) {
  assert(String(req.headers['content-type']||'').split(';')[0]==='application/json','JSON is required.',415);
  const buffer=await readBody(req,256*1024); let result;
  try {result=JSON.parse(buffer.toString('utf8'));} catch {throw new HttpError(400,'Invalid JSON request.');}
  assert(result && typeof result==='object'&&!Array.isArray(result),'An object is required.'); return result;
}
export const escapeHtml = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const safeJson = data => JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
