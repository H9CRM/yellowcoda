import http from 'node:http';
import { createReadStream, statSync, existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { config, ROOT } from './config.mjs';
import { db, getSettings, listProducts } from './db.mjs';
import { securityHeaders, getSession, HttpError } from './security.mjs';
import { handleApi, sendJson } from './api.mjs';
import { flushOutbox } from './mail.mjs';
import * as views from './views.mjs';

const dist = path.join(ROOT, 'dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.mp4':'video/mp4', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.json':'application/json; charset=utf-8', '.webmanifest':'application/manifest+json' };

function sendFile(req,res,file,type,cache='public, max-age=3600') {
  let st; try { st=statSync(file); } catch { throw new HttpError(404,'Asset not found.'); }
  if (!st.isFile()) throw new HttpError(404,'Asset not found.');
  res.setHeader('Content-Type',type); res.setHeader('Cache-Control',cache);
  if (type === 'video/mp4') {
    res.setHeader('Accept-Ranges','bytes');
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]),st.size-1) : st.size-1;
      if (start >= st.size || end < start) { res.statusCode=416; res.setHeader('Content-Range',`bytes */${st.size}`); res.end(); return; }
      res.statusCode=206; res.setHeader('Content-Range',`bytes ${start}-${end}/${st.size}`); res.setHeader('Content-Length',end-start+1);
      if (req.method === 'HEAD') { res.end(); return; }
      createReadStream(file,{start,end}).pipe(res); return;
    }
  }
  res.setHeader('Content-Length',st.size);
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(file).pipe(res);
}

function staticFile(pathname) {
  const suffix = pathname === '/' ? '/index.html' : pathname.endsWith('/') ? `${pathname}index.html` : path.extname(pathname) ? pathname : `${pathname}/index.html`;
  const file = path.resolve(dist, `.${suffix}`);
  if (!file.startsWith(dist + path.sep)) throw new HttpError(403,'Not available.');
  return file;
}

export function createAppServer() { return http.createServer(async(req,res) => {
  const nonce = randomBytes(18).toString('base64'); securityHeaders(res,nonce);
  try {
    const url = new URL(req.url,config.origin);
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) throw new HttpError(400,'Invalid path.');
    if (pathname.startsWith('/api/')) { const session=getSession(req,res,req.method==='GET'); await handleApi(req,res,url,session); return; }
    if (!['GET','HEAD'].includes(req.method)) throw new HttpError(405,'Method not allowed.');
    if (pathname === '/compare' || pathname === '/compare/') { res.statusCode=301; res.setHeader('Location','/products'); res.end(); return; }
    if (pathname === '/search' || pathname === '/search/') { res.statusCode=301; res.setHeader('Location','/'); res.end(); return; }
    if (pathname === '/services' || pathname === '/services/') { res.statusCode=301; res.setHeader('Location','/about#craft'); res.end(); return; }
    if (pathname.startsWith('/media/products/')) {
      const filename=pathname.split('/').at(-1);
      const row=db.prepare("SELECT * FROM assets WHERE filename=? AND purpose='product'").get(filename);
      if (!row) throw new HttpError(404,'Image not found.');
      sendFile(req,res,path.join(config.dataDir,'assets',row.filename),row.mime,'public, max-age=86400'); return;
    }
    if (pathname.startsWith('/media/private/')) {
      const session=getSession(req,res,false),id=pathname.split('/').at(-1);
      const asset=db.prepare("SELECT * FROM assets WHERE id=? AND purpose='watch'").get(id);
      if (!session || !asset || (!session.admin_id && asset.session_id !== session.id)) throw new HttpError(404,'Image not found.');
      res.setHeader('Content-Disposition',`inline; filename="watch-reference.${path.extname(asset.filename).slice(1)}"`);
      sendFile(req,res,path.join(config.dataDir,'assets',asset.filename),asset.mime,'private, no-store'); return;
    }
    if (pathname === '/admin' || pathname === '/admin/') {
      const session=getSession(req,res),settings=getSettings(),products=listProducts();
      const body=views.adminPage(Boolean(db.prepare('SELECT 1 FROM admins LIMIT 1').get()));
      const html=views.pageShell({title:'Atelier administration',body,path:'/admin',settings,products,nonce,csrf:session.csrf,noindex:true});
      res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.end(req.method==='HEAD'?'':html);return;
    }
    if (pathname.length>1 && pathname.endsWith('/') && !path.extname(pathname)) { res.statusCode=301;res.setHeader('Location',pathname.slice(0,-1)+url.search);res.end();return; }
    let file=staticFile(pathname);
    if (!existsSync(file)) {
      const fallback=path.join(dist,'404','index.html');
      if (!existsSync(fallback)) throw new HttpError(404,'Page not found.');
      res.statusCode=404;file=fallback;
    }
    const ext=path.extname(file),type=mime[ext];
    if (!type) throw new HttpError(404,'Not available.');
    sendFile(req,res,file,type,ext==='.html'?'public, max-age=300':'public, max-age=86400');
  } catch(error) {
    if (res.headersSent) { res.end(); return; }
    const status=error.status || 500;
    if (status===500) console.error(`[${new Date().toISOString()}] ${req.method} ${req.url?.split('?')[0]}:`,error.stack);
    sendJson(res,status,{error:status===500?'An unexpected error occurred.':error.message});
  }
}); }

export const server=createAppServer();
if (process.env.TEST_IMPORT_ONLY !== 'true') {
  server.requestTimeout=20000;server.headersTimeout=15000;server.keepAliveTimeout=5000;
  server.listen(config.port,config.host,()=>console.log(`YellowCada storefront and enquiry API: ${config.origin}`));
  const mailTimer=setInterval(()=>flushOutbox().catch(console.error),60000);mailTimer.unref();
  const cleanup=setInterval(()=>{const now=Date.now();db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now);db.prepare('DELETE FROM rate_windows WHERE resets<?').run(now);for(const a of db.prepare("SELECT id,filename FROM assets WHERE purpose='watch' AND order_id IS NULL AND created_at<datetime('now','-1 day')").all()){try{unlinkSync(path.join(config.dataDir,'assets',a.filename));}catch{}db.prepare('DELETE FROM assets WHERE id=?').run(a.id);}},3600000);cleanup.unref();
  let stopping=false;const stop=()=>{if(stopping)return;stopping=true;clearInterval(mailTimer);clearInterval(cleanup);server.close(()=>{db.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();};process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
