import http from 'node:http';
import { createReadStream, statSync, existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { config, ROOT } from './config.mjs';
import { db, getSettings, listProducts, productFromRow } from './db.mjs';
import { securityHeaders, getSession, escapeHtml, HttpError } from './security.mjs';
import { handleApi, sendJson } from './api.mjs';
import { flushOutbox } from './mail.mjs';
import * as views from './views.mjs';
import { articles } from './content.mjs';
const mime={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
function sendFile(req,res,file,type,cache='public, max-age=3600') {
  let st;try{st=statSync(file);}catch{throw new HttpError(404,'Asset not found.');}if(!st.isFile())throw new HttpError(404,'Asset not found.');
  res.setHeader('Content-Type',type);res.setHeader('Content-Length',st.size);res.setHeader('Cache-Control',cache);if(req.method==='HEAD'){res.end();return;}createReadStream(file).pipe(res);
}
const pages=['/','/shop','/build-your-strap','/leather-library','/our-craft','/size-guide','/find-my-strap','/journal','/about','/faq','/contact','/policies/shipping','/policies/replacement','/policies/privacy','/policies/terms'];
export function createAppServer(){return http.createServer(async(req,res)=>{
 const nonce=randomBytes(18).toString('base64');securityHeaders(res,nonce);
 try{
  const url=new URL(req.url,config.origin),pathname=decodeURIComponent(url.pathname);
  if(pathname.includes('\0')||pathname.includes('\\'))throw new HttpError(400,'Invalid path.');
  if(req.method==='GET'&&/^\/(assets|css|js)\//.test(pathname)){
    const base=path.join(ROOT,'public'),file=path.resolve(base,'.'+pathname);
    if(!file.startsWith(base+path.sep))throw new HttpError(403,'Not available.');const ext=path.extname(file);if(!mime[ext])throw new HttpError(404,'Not available.');sendFile(req,res,file,mime[ext]);return;
  }
  if(req.method==='GET'&&pathname.startsWith('/media/products/')){
    const filename=pathname.split('/').at(-1);const row=db.prepare("SELECT * FROM assets WHERE filename=? AND purpose='product'").get(filename);if(!row)throw new HttpError(404,'Image not found.');sendFile(req,res,path.join(config.dataDir,'assets',row.filename),row.mime,'public, max-age=86400');return;
  }
  if(req.method==='GET'&&pathname.startsWith('/media/private/')){
    const session=getSession(req,res,false),id=pathname.split('/').at(-1),asset=db.prepare("SELECT * FROM assets WHERE id=? AND purpose='watch'").get(id);
    if(!session||!asset||(!session.admin_id&&asset.session_id!==session.id))throw new HttpError(404,'Image not found.');res.setHeader('Content-Disposition','inline; filename="watch-reference.'+path.extname(asset.filename).slice(1)+'"');sendFile(req,res,path.join(config.dataDir,'assets',asset.filename),asset.mime,'private, no-store');return;
  }
  if(pathname.startsWith('/api/')){const session=getSession(req,res,req.method==='GET');await handleApi(req,res,url,session);return;}
  if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Method not allowed.');
  const settings=getSettings();
  if(pathname==='/robots.txt'){res.setHeader('Content-Type','text/plain');res.end(!settings.launchApproved?'User-agent: *\nDisallow: /\n':`User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /media/private/\nDisallow: /cart\nDisallow: /checkout\nDisallow: /track-order\nDisallow: /saved-straps\nSitemap: ${config.origin}/sitemap.xml\n`);return;}
  if(pathname==='/sitemap.xml'){
    const locations=settings.launchApproved?[...pages,...articles.map(a=>'/journal/'+a.slug),...listProducts().filter(p=>p.approved&&!p.sample).map(p=>'/products/'+p.slug)]:[];
    res.setHeader('Content-Type','application/xml; charset=utf-8');res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.map(l=>`<url><loc>${escapeHtml(config.origin+l)}</loc></url>`).join('')}</urlset>`);return;
  }
  if(pathname.length>1&&pathname.endsWith('/')){res.statusCode=301;res.setHeader('Location',pathname.replace(/\/+$/,'')+url.search);res.end();return;}
  const aliases={'/watch-straps':'/shop','/custom-watch-straps':'/build-your-strap','/how-to-measure-watch-strap':'/size-guide','/shipping-delivery':'/policies/shipping','/returns':'/policies/replacement'};
  if(aliases[pathname]){res.statusCode=301;res.setHeader('Location',aliases[pathname]);res.end();return;}
  const session=getSession(req,res),products=listProducts();let body,title,status=200,noindex=Boolean(url.search),bootstrap={},structured=null;
  if(pathname==='/'){body=views.home(settings,products);title='Handcrafted around your watch';}
  else if(pathname==='/shop'){body=views.shop(products);title='Leather watch strap collection';}
  else if(pathname.startsWith('/products/')){
    const p=productFromRow(db.prepare('SELECT * FROM products WHERE slug=? AND active=1').get(pathname.split('/').at(-1)));
    if(p){body=views.productPage(p,settings);title=p.name+' leather watch strap';bootstrap={product:p};noindex=Boolean(p.sample)||noindex;
      if(settings.launchApproved&&p.approved&&!p.sample){structured={'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,sku:p.sku,image:config.origin+p.image,brand:{'@type':'Brand',name:'YellowCada'}};if(p.price_paisa>0&&settings.salesEnabled)structured.offers={'@type':'Offer',url:config.origin+pathname,priceCurrency:'PKR',price:(p.price_paisa/100).toFixed(2),availability:p.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'};}
    }
  }
  else if(pathname==='/build-your-strap'){body=views.builder(products);title='Build your leather watch strap';}
  else if(pathname==='/cart'){body=views.cartPage();title='Your strap bag';noindex=true;}
  else if(pathname==='/checkout'){body=views.checkoutPage();title='Checkout and configuration enquiry';noindex=true;}
  else if(pathname==='/leather-library'){body=views.leatherLibrary();title='Leather, lining and materials';}
  else if(pathname==='/our-craft'){body=views.craftPage();title='Materials and craft';}
  else if(pathname==='/journal'){body=views.journalPage();title='The watch strap journal';}
  else if(pathname==='/size-guide'){body=views.articlePage(articles[0]);title='Watch strap measurement guide';}
  else if(pathname.startsWith('/journal/')){const a=articles.find(a=>a.slug===pathname.split('/').at(-1));if(a){body=views.articlePage(a);title=a.title;}}
  else if(pathname==='/about'){body=views.aboutPage();title='About YellowCada';}
  else if(pathname==='/faq'){body=views.faqPage();title='Watch strap questions answered';}
  else if(pathname==='/contact'){body=views.contactPage(settings);title='Contact YellowCada';}
  else if(pathname==='/find-my-strap'){body=views.contactPage(settings,true);title='Watch strap fitting assistance';}
  else if(pathname==='/track-order'){body=views.trackingPage();title='Track your order';noindex=true;}
  else if(pathname==='/replacement'){body=views.trackingPage(true);title='Sizing replacement request';noindex=true;}
  else if(pathname.startsWith('/policies/')){const slug=pathname.split('/').at(-1);body=views.policyPage(slug,settings);title='Customer information: '+slug;}
  else if(pathname==='/saved-straps'){body=views.savedPage();title='Your saved configurations';noindex=true;}
  else if(pathname==='/admin'){body=views.adminPage(Boolean(db.prepare('SELECT 1 FROM admins LIMIT 1').get()));title='Atelier administration';noindex=true;}
  if(!body){body=views.missingPage();title='Page not found';status=404;noindex=true;}
  res.statusCode=status;res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','private, no-store');
  const html=views.pageShell({title,body,path:pathname,settings,products,nonce,csrf:session.csrf,bootstrap,status,noindex,structured});res.end(req.method==='HEAD'?'':html);
 }catch(error){
  if(res.headersSent){res.end();return;}const status=error.status||((String(error.code).includes('SQLITE_CONSTRAINT'))?409:500);
  const message=status===500?'An unexpected error occurred. Please try again.':(status===409&&!error.status?'This value is already in use. Check the product URL or SKU.':error.message);
  if(status===500)console.error(`[${new Date().toISOString()}] ${req.method} ${req.url?.split('?')[0]}:`,error.stack);
  sendJson(res,status,{error:message});
 }
});}
export const server=createAppServer();
if(process.env.TEST_IMPORT_ONLY!=='true'){
 server.requestTimeout=20000;server.headersTimeout=15000;server.keepAliveTimeout=5000;
 server.listen(config.port,config.host,()=>console.log(`\nYellowCada atelier is running at ${config.origin}\nDatabase stored privately. Preview mode is controlled in /admin.\n`));
 const mailTimer=setInterval(()=>flushOutbox().catch(console.error),60000);mailTimer.unref();
 const cleanup=setInterval(()=>{const now=Date.now();db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now);db.prepare('DELETE FROM rate_windows WHERE resets<?').run(now);for(const a of db.prepare("SELECT id,filename FROM assets WHERE purpose='watch' AND order_id IS NULL AND created_at<datetime('now','-1 day')").all()){try{unlinkSync(path.join(config.dataDir,'assets',a.filename));}catch{}db.prepare('DELETE FROM assets WHERE id=?').run(a.id);}},3600000);cleanup.unref();
 let stopping=false;const stop=()=>{if(stopping)return;stopping=true;clearInterval(mailTimer);clearInterval(cleanup);server.close(()=>{db.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();};process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
