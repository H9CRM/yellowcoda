import { randomBytes, createHmac } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import { db, getSettings, getProduct, listProducts, transaction, audit } from './db.mjs';
import { assert, HttpError, randomToken, sha256, csrfCheck, rateLimit, readJson, readBody, passwordCheck, passwordHash, rotateSession } from './security.mjs';
import { text, email, integer, customerData, validateOptions, validateEnquiryOptions, validateCatalogueEnquiryOptions, unitPrice, checkoutAllowed, validateSpec, orderStatuses, priceFormat } from './domain.mjs';
import { normaliseImage } from './images.mjs';
import { queueMail, flushOutbox, mailConfigured } from './mail.mjs';
import { catalogProducts } from '../src/data/catalogue.js';
db.exec('CREATE TABLE IF NOT EXISTS secrets(name TEXT PRIMARY KEY,value TEXT NOT NULL)');
if(!db.prepare("SELECT 1 FROM secrets WHERE name='order_access'").get())db.prepare('INSERT INTO secrets VALUES(?,?)').run('order_access',randomToken());
const accessSecret=db.prepare("SELECT value FROM secrets WHERE name='order_access'").get().value;
const accessToken=id=>createHmac('sha256',accessSecret).update(id).digest('hex');
const dummyHash='ec11bab0721faad9f583dffac61bf297:'+('00'.repeat(64));
export const sendJson=(res,status,data)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));};
const needAdmin=s=>assert(s?.admin_id,'Administrator sign-in is required.',401);
function getOrder(reference,access){
  assert(typeof reference==='string'&&/^YC-[A-Z0-9-]{8,30}$/.test(reference),'The reference or private access code is incorrect.',404);
  assert(typeof access==='string'&&/^[a-f0-9]{64}$/.test(access),'The reference or private access code is incorrect.',404);
  const row=db.prepare('SELECT * FROM orders WHERE id=? AND access_hash=?').get(reference,sha256(access));
  assert(row,'The reference or private access code is incorrect.',404);return row;
}
export function quoteItems(items,settings,enquiryOnly=false){
  assert(Array.isArray(items)&&items.length>0&&items.length<=25,'Choose between 1 and 25 products.');
  const totals=new Map();
  const rows=items.map(item=>{
    if(enquiryOnly && typeof item.productId === 'string') {
      assert(/^catalog-\d{1,3}$/.test(item.productId),'Product ID is invalid.');
      integer(item.quantity,'Quantity',1,10);
      const product=catalogProducts.find(entry=>entry.id===item.productId);
      assert(product,'A selected product is no longer available.',409);
      const options=validateCatalogueEnquiryOptions(item.options,product);
      return {productId:product.id,slug:product.slug,name:product.name,colour:null,image:product.image,quantity:item.quantity,options,assetId:null,unitPaisa:null,totalPaisa:null,purchasable:false,specSnapshot:null,sample:false,archiveReference:true};
    }
    integer(item.productId,'Product ID',1);integer(item.quantity,'Quantity',1,10);
    const p=getProduct(item.productId);assert(p&&p.active,'A selected strap is no longer available.',409);
    const options=enquiryOnly?validateEnquiryOptions(item.options):validateOptions(item.options,p),price=enquiryOnly?null:unitPrice(p,options);
    totals.set(p.id,(totals.get(p.id)||0)+item.quantity);
    const assetId=item.assetId?text(item.assetId,'Photo reference',64):null;
    return {productId:p.id,slug:p.slug,name:p.name,colour:p.colour,image:p.image,quantity:item.quantity,options,assetId,unitPaisa:price,totalPaisa:price===null?null:price*item.quantity,purchasable:!enquiryOnly&&checkoutAllowed(p,settings)&&options.fitConfirmed,specSnapshot:enquiryOnly?null:{leather:p.spec.leather,origin:p.spec.origin,buckle:p.spec.buckle,production:p.spec.production||'1–3 working days'},sample:Boolean(p.sample)};
  });
  const allPurchasable=rows.every(row=>row.purchasable)&&[...totals].every(([id,qty])=>getProduct(id).stock>=qty);
  const subtotal=rows.some(r=>r.totalPaisa===null)?null:rows.reduce((s,r)=>s+r.totalPaisa,0);
  return {items:rows,purchasable:allPurchasable,subtotalPaisa:subtotal,shippingPaisa:settings.shippingPaisa,totalPaisa:subtotal===null||settings.shippingPaisa===null?null:subtotal+settings.shippingPaisa,currency:'PKR',taxNote:settings.taxNote,shippingLabel:settings.shippingLabel,paymentMethods:settings.salesEnabled?[...(settings.bankInstructions?['bank_transfer']:[]),...(settings.codEnabled?['cash_on_delivery']:[])]:[]};
}
const orderObject=row=>({...row,customer:JSON.parse(row.customer),items:JSON.parse(row.items),access_hash:undefined,session_id:undefined,idempotency_key:undefined,body_hash:undefined,response:undefined,events:db.prepare('SELECT status,note,created_at FROM order_events WHERE order_id=? ORDER BY id').all(row.id)});
export async function handleApi(req,res,url,session){
 const route=url.pathname;
 res.setHeader('Cache-Control','no-store');
 if(req.method==='GET'&&route==='/api/health'){sendJson(res,200,{status:'ok'});return;}
 rateLimit(req,'api',160,60000);
 if(!['GET','HEAD'].includes(req.method))csrfCheck(req,session);
 if(req.method==='GET'&&route==='/api/bootstrap'){sendJson(res,200,{csrf:session.csrf,settings:getSettings(),products:listProducts(),admin:Boolean(session.admin_id)});return;}
 if(req.method==='GET'&&route==='/api/products'){sendJson(res,200,{products:listProducts()});return;}
 if(req.method==='POST'&&route==='/api/auth/login'){
   rateLimit(req,'login',8,15*60000);const body=await readJson(req);const address=email(body.email);rateLimit(req,`login-${sha256(address)}`,5,15*60000);
   const admin=db.prepare('SELECT * FROM admins WHERE email=?').get(address);
   const valid=await passwordCheck(body.password,admin?.password_hash||dummyHash);
   assert(admin&&valid,'Incorrect email or password.',401);
   const fresh=rotateSession(req,res,session,admin.id);audit(admin.id,'login',admin.id);
   sendJson(res,200,{ok:true,csrf:fresh.csrf});return;
 }
 if(req.method==='POST'&&route==='/api/auth/logout'){
   if(session.admin_id)audit(session.admin_id,'logout',session.admin_id);
   const fresh=rotateSession(req,res,session);sendJson(res,200,{ok:true,csrf:fresh.csrf});return;
 }
 if(req.method==='POST'&&route==='/api/cart/quote'){
   const body=await readJson(req);sendJson(res,200,quoteItems(body.items,getSettings()));return;
 }
 if(req.method==='POST'&&['/api/orders','/api/enquiries'].includes(route)){
   rateLimit(req,'place-order',10,60*60000);const body=await readJson(req);assert(!body.website,'Request could not be accepted.');
   const key=text(req.headers['idempotency-key']||'','Idempotency key',100);assert(/^[A-Za-z0-9_-]{16,100}$/.test(key),'Invalid idempotency key.');
   const bodyHash=sha256(JSON.stringify(body)+route),old=db.prepare('SELECT * FROM orders WHERE idempotency_key=?').get(key);
   if(old){assert(old.session_id===session.id&&old.body_hash===bodyHash,'This submission key has already been used for different details.',409);sendJson(res,200,{...JSON.parse(old.response),accessCode:accessToken(old.id),replayed:true});return;}
   const sale=route==='/api/orders',settings=getSettings();const customer=customerData(body.customer,sale);
   assert(body.reviewConfirmed===true,'Confirm that you reviewed the measurements and configuration.');
   if(sale)assert(body.termsAccepted===true,'Accept the published ordering terms to proceed.');
   const result=transaction(()=>{
     const summary=quoteItems(body.items,settings,!sale);
     if(sale){assert(summary.purchasable,'This configuration cannot be purchased yet. Confirm approved materials, fit, stock and store settings, or send an enquiry.',409);assert(summary.paymentMethods.includes(body.paymentMethod),'Choose an available payment method.');}
     const id=`YC-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${randomBytes(5).toString('hex').toUpperCase()}`;
     const code=accessToken(id),kind=sale?'order':'enquiry',status='received';
     const paymentStatus=sale?(body.paymentMethod==='bank_transfer'?'awaiting_transfer':'due_on_delivery'):'not_applicable';
     const publicResult={reference:id,kind,totalPaisa:sale?summary.totalPaisa:null,currency:'PKR',status,paymentStatus,paymentMethod:sale?body.paymentMethod:null,bankInstructions:sale&&body.paymentMethod==='bank_transfer'?settings.bankInstructions:null,notification:'queued',emailConfigured:mailConfigured()};
     if(sale){const aggregate=new Map();for(const item of summary.items)aggregate.set(item.productId,(aggregate.get(item.productId)||0)+item.quantity);for(const [pid,qty]of aggregate){const r=db.prepare('UPDATE products SET stock=stock-? WHERE id=? AND stock>=?').run(qty,pid,qty);assert(r.changes===1,'Availability changed. Refresh the bag and try again.',409);}}
     db.prepare('INSERT INTO orders(id,access_hash,session_id,kind,customer,items,subtotal,shipping,total,payment_method,payment_status,status,idempotency_key,body_hash,response) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,sha256(code),session.id,kind,JSON.stringify(customer),JSON.stringify(summary.items),sale?summary.subtotalPaisa:null,sale?summary.shippingPaisa:null,sale?summary.totalPaisa:null,sale?body.paymentMethod:null,paymentStatus,status,key,bodyHash,JSON.stringify(publicResult));
     for(const item of summary.items)if(item.assetId){
       const asset=db.prepare("SELECT * FROM assets WHERE id=? AND session_id=? AND purpose='watch' AND (order_id IS NULL OR order_id=?)").get(item.assetId,session.id,id);
       assert(asset,'The uploaded photograph is no longer available for this session. Upload it again.',409);db.prepare('UPDATE assets SET order_id=? WHERE id=?').run(id,item.assetId);
     }
     db.prepare('INSERT INTO order_events(order_id,status,note) VALUES(?,?,?)').run(id,status,sale?'Order received; payment status shown separately.':'Configuration enquiry received. No purchase or payment commitment.');
     const message=`Hello ${customer.name},\n\nYour YellowCada ${kind} reference is ${id}.\nPrivate access code: ${code}\n\nTrack it at ${config.origin}/track-order. Keep your code private.\n\n${sale?`Total: ${priceFormat(summary.totalPaisa)}\nPayment: ${paymentStatus}\n${body.paymentMethod==='bank_transfer'?settings.bankInstructions:''}`:'This is an enquiry, not a paid order. Materials, fit, price and delivery must be confirmed before purchase.'}\n\n${sale?'Configuration':'Design enquiry'}:\n${summary.items.map(i=>`${i.quantity} × ${i.name}\n${JSON.stringify(i.options,null,2)}`).join('\n\n')}${sale?'\n\nProduction is usually 1–3 working days after confirmation. Transit is separate.':''}`;
     queueMail(customer.email,`YellowCada ${kind} ${id}`,message);
     if(process.env.SUPPORT_NOTIFY_EMAIL)queueMail(process.env.SUPPORT_NOTIFY_EMAIL,`New YellowCada ${kind}: ${id}`,`A new ${kind} is ready for review in the private administration dashboard.`);
     return {...publicResult,accessCode:code};
   });
   sendJson(res,201,result);return;
 }
 if(req.method==='POST'&&route==='/api/orders/track'){
   rateLimit(req,'track',12,15*60000);const body=await readJson(req);const row=getOrder(body.reference,body.accessCode);
   const order=orderObject(row);delete order.notes;
   sendJson(res,200,{order});return;
 }
 if(req.method==='POST'&&route==='/api/replacements'){
   rateLimit(req,'replacement',5,60*60000);const body=await readJson(req);const row=getOrder(body.reference,body.accessCode);assert(row.kind==='order','Sizing replacements apply to completed purchase orders, not unpriced enquiries.');
   const details=text(body.details,'Corrected measurements and issue',2000);const id='YR-'+randomBytes(5).toString('hex').toUpperCase();
   db.prepare('INSERT INTO replacements(id,order_id,details) VALUES(?,?,?)').run(id,row.id,details);
   sendJson(res,201,{reference:id,message:'Your sizing request was recorded for review. Replacement eligibility and arrangements have not yet been approved.'});return;
 }
 if(req.method==='POST'&&route==='/api/contact'){
   rateLimit(req,'contact',6,60*60000);const body=await readJson(req);assert(!body.website,'Request could not be accepted.');
   const name=text(body.name,'Name',100),address=email(body.email),message=text(body.message,'Message',2500);const kind=body.kind==='fit'?'fit':'contact';
   let detail=message;
   if(kind==='fit')detail=`Watch: ${text(body.watch,'Watch model',150)}\nLug width: ${text(String(body.width||''),'Lug width',15,false)} mm\nWrist: ${text(String(body.wrist||''),'Wrist',15,false)} in\n\n${message}`;
   const inserted=db.prepare('INSERT INTO messages(kind,name,email,body) VALUES(?,?,?,?)').run(kind,name,address,detail);
   if(process.env.SUPPORT_NOTIFY_EMAIL)queueMail(process.env.SUPPORT_NOTIFY_EMAIL,`YellowCada ${kind} enquiry`,`${name} submitted an enquiry. Read it in the private admin dashboard.`);
   sendJson(res,201,{reference:`YM-${inserted.lastInsertRowid}`,message:'Your message has been recorded for the atelier. No fit or production commitment has been made.'});return;
 }
 if(req.method==='POST'&&route==='/api/uploads/watch'){
   rateLimit(req,'watch-photo',15,60*60000);const image=normaliseImage(await readBody(req,4*1024*1024));const id=randomBytes(18).toString('hex');
   const dir=path.join(config.dataDir,'assets');mkdirSync(dir,{recursive:true,mode:0o700});const filename=`${id}.${image.extension}`;writeFileSync(path.join(dir,filename),image.buffer,{mode:0o600});
   db.prepare('INSERT INTO assets(id,session_id,mime,filename,purpose) VALUES(?,?,?,?,?)').run(id,session.id,image.mime,filename,'watch');
   sendJson(res,201,{id,message:'Private reference uploaded. GPS/EXIF and comment metadata removed.'});return;
 }
 if(route.startsWith('/api/admin/')){
   needAdmin(session);
   if(req.method==='GET'&&route==='/api/admin/dashboard'){
     const stats={orders:db.prepare("SELECT count(*) AS n FROM orders WHERE kind='order'").get().n,enquiries:db.prepare("SELECT count(*) AS n FROM orders WHERE kind='enquiry'").get().n,revenuePaisa:db.prepare("SELECT coalesce(sum(total),0) AS n FROM orders WHERE payment_status='paid' AND status!='cancelled'").get().n,openMessages:db.prepare("SELECT count(*) AS n FROM messages WHERE status='new'").get().n};
     sendJson(res,200,{stats,settings:getSettings(),products:listProducts(true),orders:db.prepare('SELECT id,kind,status,total,payment_status,created_at,customer FROM orders ORDER BY created_at DESC LIMIT 300').all().map(r=>({...r,customer:JSON.parse(r.customer)})),messages:db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 200').all(),replacements:db.prepare('SELECT * FROM replacements ORDER BY created_at DESC LIMIT 100').all(),outbox:db.prepare('SELECT id,recipient,subject,status,attempts,last_error,created_at FROM outbox ORDER BY id DESC LIMIT 100').all(),audit:db.prepare('SELECT id,action,entity,created_at FROM audit ORDER BY id DESC LIMIT 100').all(),mailConfigured:mailConfigured(),csrf:session.csrf});return;
   }
   if(req.method==='GET'&&/^\/api\/admin\/orders\/[^/]+$/.test(route)){
     const row=db.prepare('SELECT * FROM orders WHERE id=?').get(route.split('/').at(-1));assert(row,'Order not found.',404);const order=orderObject(row);order.assets=db.prepare('SELECT id,filename,purpose FROM assets WHERE order_id=?').all(row.id);sendJson(res,200,{order});return;
   }
   if(req.method==='POST'&&/^\/api\/admin\/orders\/[^/]+\/status$/.test(route)){
     const id=route.split('/')[4],body=await readJson(req),row=db.prepare('SELECT * FROM orders WHERE id=?').get(id);assert(row,'Order not found.',404);
     const next=text(body.status,'Status',40),note=text(body.note||'','Status note',500,false);
     transaction(()=>{
       if(row.kind==='enquiry')assert((row.status==='received'&&next==='reviewed')||(row.status==='reviewed'&&next==='closed'),'Invalid enquiry transition.');
       else if(next==='cancelled'){
         assert(!['cancelled','dispatched','delivered'].includes(row.status),'This order cannot be cancelled through this status action.');
         for(const item of JSON.parse(row.items))db.prepare('UPDATE products SET stock=stock+? WHERE id=?').run(item.quantity,item.productId);
       }else{
         const current=orderStatuses.indexOf(row.status);assert(current>=0&&orderStatuses[current+1]===next,'Move the order forward one valid production stage at a time.');
         if(['in_production','dispatched'].includes(next)&&row.payment_method==='bank_transfer')assert(row.payment_status==='paid','Confirm the bank payment before this production stage.');
       }
       db.prepare('UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next,id);db.prepare('INSERT INTO order_events(order_id,status,note) VALUES(?,?,?)').run(id,next,note);audit(session.admin_id,'order_status',id,{from:row.status,to:next});
       queueMail(JSON.parse(row.customer).email,`YellowCada ${id}: ${next.replaceAll('_',' ')}`,`Your ${row.kind} status is now ${next.replaceAll('_',' ')}.\n${note}\nView the details with your private access code at ${config.origin}/track-order.\nThis message does not change your recorded payment status.`);
     });sendJson(res,200,{ok:true});return;
   }
   if(req.method==='POST'&&/^\/api\/admin\/orders\/[^/]+\/payment$/.test(route)){
     const id=route.split('/')[4],body=await readJson(req),row=db.prepare('SELECT * FROM orders WHERE id=?').get(id);assert(row&&row.kind==='order','Purchase order not found.',404);
     const next=text(body.status,'Payment status',30),note=text(body.note,'External payment evidence / note',500);
     assert((next==='paid'&&['awaiting_transfer','due_on_delivery'].includes(row.payment_status))||(next==='refunded'&&row.payment_status==='paid'),'Invalid payment transition.');
     assert(!(next==='paid'&&row.status==='cancelled'),'Do not mark a cancelled order paid.');
     transaction(()=>{db.prepare('UPDATE orders SET payment_status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next,id);audit(session.admin_id,'manual_payment',id,{from:row.payment_status,to:next,note});db.prepare('INSERT INTO order_events(order_id,status,note) VALUES(?,?,?)').run(id,`payment_${next}`,note);});sendJson(res,200,{ok:true,message:'Record updated only. No payment or refund was executed by this application.'});return;
   }
   if(req.method==='POST'&&route==='/api/admin/settings'){
     const body=await readJson(req),old=getSettings(),out={...old};
     const strings={brand:80,tagline:200,email:254,whatsapp:25,address:300,legalName:200,shippingLabel:500,taxNote:1000,bankInstructions:3000,privacyText:20000,termsText:20000,returnsText:20000,shippingText:20000,heroHeading:100,heroText:300,announcement:180};
     for(const [key,max]of Object.entries(strings))if(key in body)out[key]=text(body[key],key,max,false);
     assert(out.brand==='YellowCada','Keep the project identity YellowCada.');
     if(out.email)out.email=email(out.email);
     if(out.whatsapp)assert(/^[1-9][0-9]{7,14}$/.test(out.whatsapp),'Use international WhatsApp digits only, without + or spaces.');
     for(const key of ['salesEnabled','launchApproved','policiesApproved','codEnabled'])if(key in body){assert(typeof body[key]==='boolean',`${key} must be a boolean.`);out[key]=body[key];}
     if('shippingPaisa'in body)out.shippingPaisa=body.shippingPaisa===null?null:integer(body.shippingPaisa,'Shipping charge',0,10000000);
     if(out.launchApproved){assert(out.legalName&&out.email,'Before launch, identify the seller and an official support email.');assert(listProducts().some(p=>p.approved&&!p.sample&&p.spec.imageApproved&&p.spec.materialsApproved),'Approve at least one real catalogue product and its image before launch.');}
     if(out.salesEnabled){assert(out.launchApproved&&out.policiesApproved,'Approve the launch and all required policies before enabling sales.');for(const key of ['privacyText','termsText','returnsText','shippingText','taxNote','legalName','email'])assert(out[key]?.trim(),`Complete ${key} before enabling sales.`);assert(out.shippingPaisa!==null,'Set an approved shipping charge.');assert(out.codEnabled||out.bankInstructions,'Configure an approved bank-transfer or cash-on-delivery method.');}
     transaction(()=>{for(const [key,value]of Object.entries(out))db.prepare('INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)').run(key,JSON.stringify(value));audit(session.admin_id,'settings','store',{salesEnabled:out.salesEnabled,launchApproved:out.launchApproved});});sendJson(res,200,{ok:true,settings:out});return;
   }
   if(req.method==='POST'&&route==='/api/admin/products'){
     const b=await readJson(req),existing=b.id?getProduct(integer(b.id,'ID',1)):null;if(b.id)assert(existing,'Product not found.',404);
     const p={slug:text(b.slug,'Slug',80),sku:text(b.sku,'SKU',60),name:text(b.name,'Product name',100),subtitle:text(b.subtitle||'','Subtitle',200,false),description:text(b.description,'Description',2500),colour:text(b.colour,'Colour',40),hex:text(b.hex,'Colour hex',7),style:text(b.style,'Style',40),image:text(b.image,'Product image',180),spec:validateSpec(b.spec),stock:integer(b.stock,'Available units',0,100000),price_paisa:b.price_paisa===null?null:integer(b.price_paisa,'Price in paisa',1,100000000),active:b.active===true?1:0,approved:b.approved===true?1:0,sample:b.sample===true?1:0};
     assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug),'Use a lowercase, hyphenated URL slug.');assert(/^#[0-9a-f]{6}$/i.test(p.hex),'Enter a six-digit hex colour.');
     if(existing)assert(p.slug===existing.slug,'Existing URLs are preserved. Add an explicit redirect before changing a published slug.');
     assert(/^\/assets\/(cognac|midnight|olive|espresso|navy|burgundy)\.svg$/.test(p.image)||/^\/media\/products\/[a-f0-9]{36}\.(png|jpg)$/.test(p.image),'Select a supplied illustration or an uploaded product photograph.');
     if(p.image.startsWith('/media/products/'))assert(db.prepare("SELECT 1 FROM assets WHERE filename=? AND purpose='product'").get(p.image.split('/').at(-1)),'Product photo was not found.');
     if(p.approved){assert(!p.sample&&p.spec.imageApproved&&p.spec.materialsApproved&&p.image.startsWith('/media/products/'),'Approved products need a real uploaded image and verified materials, and must not be marked as samples.');assert(p.price_paisa>0||p.spec.restricted,'Set a verified price for an approved normal product.');assert(p.spec.origin!=='Confirm at product level','Confirm the actual material origin before approval.');}
     const values=[p.slug,p.sku,p.name,p.subtitle,p.description,p.colour,p.hex,p.style,p.image,JSON.stringify(p.spec),p.price_paisa,p.stock,p.active,p.approved,p.sample];
     let id;transaction(()=>{if(existing){db.prepare('UPDATE products SET slug=?,sku=?,name=?,subtitle=?,description=?,colour=?,hex=?,style=?,image=?,spec=?,price_paisa=?,stock=?,active=?,approved=?,sample=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(...values,existing.id);id=existing.id;}else{id=Number(db.prepare('INSERT INTO products(slug,sku,name,subtitle,description,colour,hex,style,image,spec,price_paisa,stock,active,approved,sample) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(...values).lastInsertRowid);}audit(session.admin_id,'product_saved',id);});sendJson(res,200,{ok:true,product:getProduct(id)});return;
   }
   if(req.method==='POST'&&route==='/api/admin/uploads/product'){
     rateLimit(req,'admin-upload',40,60*60000);const image=normaliseImage(await readBody(req,4*1024*1024)),id=randomBytes(18).toString('hex'),filename=`${id}.${image.extension}`,dir=path.join(config.dataDir,'assets');mkdirSync(dir,{recursive:true,mode:0o700});writeFileSync(path.join(dir,filename),image.buffer,{mode:0o600});db.prepare("INSERT INTO assets(id,session_id,mime,filename,purpose) VALUES(?,?,?,?, 'product')").run(id,session.id,image.mime,filename);audit(session.admin_id,'product_photo',id);sendJson(res,201,{id,path:`/media/products/${filename}`,width:image.width,height:image.height});return;
   }
   if(req.method==='POST'&&/^\/api\/admin\/messages\/\d+$/.test(route)){
     const id=Number(route.split('/').at(-1)),b=await readJson(req);assert(['new','resolved'].includes(b.status),'Invalid message status.');const r=db.prepare('UPDATE messages SET status=? WHERE id=?').run(b.status,id);assert(r.changes,'Message not found.',404);audit(session.admin_id,'message_status',id,{status:b.status});sendJson(res,200,{ok:true});return;
   }
   if(req.method==='POST'&&/^\/api\/admin\/replacements\/[^/]+$/.test(route)){
     const id=route.split('/').at(-1),b=await readJson(req);assert(['received','reviewing','approved','declined','completed'].includes(b.status),'Invalid replacement status.');const r=db.prepare('UPDATE replacements SET status=? WHERE id=?').run(b.status,id);assert(r.changes,'Replacement request not found.',404);audit(session.admin_id,'replacement_status',id,{status:b.status});sendJson(res,200,{ok:true});return;
   }
   if(req.method==='POST'&&route==='/api/admin/mail/flush'){sendJson(res,200,await flushOutbox());return;}
   if(req.method==='POST'&&route==='/api/admin/password'){
     rateLimit(req,'change-password',4,60*60000);const b=await readJson(req),admin=db.prepare('SELECT * FROM admins WHERE id=?').get(session.admin_id);assert(await passwordCheck(b.current,admin.password_hash),'The current password is incorrect.',401);const hash=await passwordHash(b.password);db.prepare('UPDATE admins SET password_hash=? WHERE id=?').run(hash,session.admin_id);db.prepare('DELETE FROM sessions WHERE admin_id=? AND id!=?').run(session.admin_id,session.id);audit(session.admin_id,'password_changed',session.admin_id);const fresh=rotateSession(req,res,session,session.admin_id);sendJson(res,200,{ok:true,csrf:fresh.csrf});return;
   }
 }
 throw new HttpError(404,'API endpoint not found.');
}
