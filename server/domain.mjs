import { assert } from './security.mjs';
export function text(value,name,max=200,required=true) {
  assert(typeof value==='string',`${name} is required.`); const out=value.trim();
  assert((!required||out.length>0)&&out.length<=max,`${name} must be ${required?'1':'0'}–${max} characters.`);
  assert(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(out),`${name} contains invalid characters.`); return out;
}
export function email(value) {const s=text(value,'Email',254).toLowerCase();assert(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s),'Enter a valid email address.');return s;}
export const integer=(n,name,min=0,max=100000000)=>{assert(Number.isSafeInteger(n)&&n>=min&&n<=max,`${name} is invalid.`);return n;};
export const priceFormat = value => value==null ? 'Price on request' : new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',minimumFractionDigits:0,maximumFractionDigits:2}).format(value/100);
export function customerData(c,shipping=false) {
  assert(c&&typeof c==='object','Customer details are required.');
  const out={name:text(c.name,'Full name',100),email:email(c.email),phone:text(c.phone||'','Phone',30,false),message:text(c.message||'','Notes',1200,false)};
  if(shipping) {
    out.phone=text(c.phone,'Phone',30);assert(/^[+\d\s()\-]{7,30}$/.test(out.phone),'Enter a valid telephone number.');
    out.address=text(c.address,'Delivery address',300);out.city=text(c.city,'City',100);
    out.postcode=text(c.postcode||'','Postal code',20,false);out.country=text(c.country,'Country',2);
    assert(out.country==='PK','Online delivery is currently configured for Pakistan only. Contact us for other destinations.');
  }
  return out;
}
export function validateOptions(o,p) {
  assert(o&&typeof o==='object','Strap configuration is required.');
  const s=p.spec;
  const out={
    watch:text(o.watch||'','Watch brand / model',150,false),
    taper:text(o.taper,'Taper',10),
    padding:text(o.padding,'Construction',30),lining:text(o.lining,'Lining',80),
    thread:text(o.thread,'Thread',20),stitch:text(o.stitch,'Stitch colour',30),
    thickness:Number(o.thickness),wristMm:Number(o.wristMm),quickRelease:o.quickRelease===true,
    fitConfirmed:o.fitConfirmed===true,
  };
  assert(s.tapers.includes(out.taper),'This width / taper is not available for this product.');
  assert(s.paddings.includes(out.padding),'This construction is unavailable.');
  assert(s.linings.includes(out.lining),'This lining is unavailable.');
  assert(s.threads.includes(out.thread),'This thread size is unavailable.');
  assert(['Matching','Contrast'].includes(out.stitch),'Choose a supported stitch colour.');
  assert(s.thicknesses.includes(out.thickness),'This thickness is unavailable.');
  assert(Number.isFinite(out.wristMm)&&out.wristMm>=s.wristMin&&out.wristMm<=s.wristMax,'Wrist circumference must be between 5 and 8 inches (127–203.2 mm).');
  out.wristMm=Math.round(out.wristMm*10)/10;
  assert(!out.quickRelease||s.quickRelease,'Quick release is not available.');
  if(Array.isArray(s.disallowed)) assert(!s.disallowed.some(rule=>Object.entries(rule).every(([k,v])=>out[k]===v)),'This combination cannot be produced. Please choose another configuration.');
  return out;
}
export function validateEnquiryOptions(o) {
  assert(o && typeof o === 'object', 'Enquiry details are required.');
  const wristMm = Number(o.wristMm);
  assert(Number.isFinite(wristMm) && wristMm >= 127 && wristMm <= 203.2, 'Wrist circumference must be between 127 and 203.2 mm.');
  const lugWidthMm = o.lugWidthMm === '' || o.lugWidthMm == null ? null : Number(o.lugWidthMm);
  assert(lugWidthMm === null || (Number.isFinite(lugWidthMm) && lugWidthMm >= 10 && lugWidthMm <= 40), 'Lug width must be between 10 and 40 mm when provided.');
  return {
    watch: text(o.watch || '', 'Watch brand / model', 150, false),
    wristMm: Math.round(wristMm * 10) / 10,
    lugWidthMm: lugWidthMm === null ? null : Math.round(lugWidthMm * 10) / 10,
    preferences: text(o.preferences || '', 'Design preferences', 500, false),
    fitConfirmed: false
  };
}
export function validateCatalogueEnquiryOptions(o, product) {
  assert(o && typeof o === 'object', 'Enquiry details are required.');
  const watchItem = product.category === 'Watch straps';
  const wrist = o.wristMm === '' || o.wristMm == null ? null : Number(o.wristMm);
  const lug = o.lugWidthMm === '' || o.lugWidthMm == null ? null : Number(o.lugWidthMm);
  if (watchItem) {
    assert(wrist === null || (Number.isFinite(wrist) && wrist >= 127 && wrist <= 203.2), 'Wrist circumference must be between 127 and 203.2 mm when provided.');
    assert(lug === null || (Number.isFinite(lug) && lug >= 10 && lug <= 40), 'Lug width must be between 10 and 40 mm when provided.');
  }
  return {
    watch: watchItem ? text(o.watch || '', 'Watch brand / model', 150, false) : '',
    wristMm: watchItem && wrist !== null ? Math.round(wrist * 10) / 10 : null,
    lugWidthMm: watchItem && lug !== null ? Math.round(lug * 10) / 10 : null,
    preferences: text(o.preferences || '', 'Design preferences', 500, false),
    fitConfirmed: false
  };
}
export function unitPrice(p,o) {
  if(p.price_paisa==null) return null;
  const a=p.spec.additions||{};
  return p.price_paisa+(o.padding==='Padded'?(a.padded||0):0)+(o.lining==='Zermatt leather'?(a.zermatt||0):0)+(o.quickRelease?(a.quickRelease||0):0);
}
export function validateSpec(spec) {
  assert(spec&&typeof spec==='object','Product specifications are required.');
  for(const k of ['leather','origin','buckle']) text(spec[k],k,150);
  for(const k of ['thicknesses','paddings','linings','threads','tapers']) assert(Array.isArray(spec[k])&&spec[k].length>0&&spec[k].length<20,`${k} must be a non-empty array.`);
  assert(spec.thicknesses.every(n=>[2,2.5,3,3.5,4].includes(n)),'Thickness must be in the confirmed 2–4 mm range.');
  assert(spec.paddings.every(s=>['Padded','Unpadded'].includes(s)),'Invalid construction.');
  assert(spec.linings.every(s=>['Zermatt leather','Vegetable-tanned leather'].includes(s)),'Invalid lining.');
  assert(spec.threads.every(s=>['0.45 mm','0.50 mm'].includes(s)),'Invalid thread.');
  assert(spec.tapers.every(t=>/^\d{2}\/\d{2}$/.test(t)&&Number(t.split('/')[0])>=Number(t.split('/')[1])&&Number(t.split('/')[0])<=30&&Number(t.split('/')[1])>=10),'Invalid taper.');
  assert(spec.wristMin===127&&spec.wristMax===203.2,'Keep the confirmed wrist range 127–203.2 mm.');
  for(const k of ['quickRelease','restricted','imageApproved','materialsApproved']) assert(typeof spec[k]==='boolean',`${k} must be true or false.`);
  assert(spec.buckle==='316 stainless steel','The confirmed buckle specification is 316 stainless steel.');
  const a=spec.additions||{}; for(const k of ['padded','zermatt','quickRelease']) integer(a[k]??0,`Price addition: ${k}`,0,10000000);
  if(spec.disallowed!==undefined) {
    assert(Array.isArray(spec.disallowed)&&spec.disallowed.length<=30,'Invalid disallowed combinations.');
    for(const rule of spec.disallowed) assert(rule&&typeof rule==='object'&&Object.keys(rule).length>0&&Object.keys(rule).every(k=>['padding','lining','thickness','thread','quickRelease','taper'].includes(k)),'Invalid combination rule.');
  }
  return {...spec,additions:{padded:a.padded||0,zermatt:a.zermatt||0,quickRelease:a.quickRelease||0}};
}
export function checkoutAllowed(p,settings) {
  return Boolean(settings.salesEnabled&&settings.policiesApproved&&settings.launchApproved&&p.active&&p.approved&&!p.sample&&p.price_paisa>0&&p.stock>0&&p.spec.materialsApproved&&p.spec.imageApproved&&!p.spec.restricted&&settings.shippingPaisa!==null);
}
export const orderStatuses=['received','measurements_verified','in_production','quality_check','ready_to_dispatch','dispatched','delivered'];
export const humanStatus=s=>String(s).replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
