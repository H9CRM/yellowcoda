import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const origin = process.env.APP_URL || 'http://localhost:3000';
const email = `yellowcada-smoke-${randomUUID()}@example.invalid`;
let reference;
try {
  const bootstrapResponse = await fetch(`${origin}/api/bootstrap`);
  if (!bootstrapResponse.ok) throw new Error('Bootstrap failed');
  const cookie = bootstrapResponse.headers.get('set-cookie')?.split(';')[0];
  const bootstrap = await bootstrapResponse.json();
  if (!cookie || !bootstrap.csrf) throw new Error('Session setup failed');
  const response = await fetch(`${origin}/api/enquiries`, { method:'POST', headers:{ 'Content-Type':'application/json', 'Cookie':cookie, 'X-CSRF-Token':bootstrap.csrf, 'Idempotency-Key':randomUUID() }, body:JSON.stringify({ customer:{ name:'Local Smoke Test', email, phone:'', message:'Synthetic test only' }, items:[{ productId:1, quantity:1, options:{ watch:'Test reference', wristMm:165, lugWidthMm:'20', preferences:'Sample colour discussion' } },{ productId:'catalog-14', quantity:1, options:{ watch:'Test watch', wristMm:165, lugWidthMm:'20', preferences:'Stitch reference' } },{ productId:'catalog-17', quantity:1, options:{ watch:'', wristMm:null, lugWidthMm:'', preferences:'Bag reference' } }], reviewConfirmed:true, website:'' }) });
  const result = await response.json();
  if (!response.ok) throw new Error(`Enquiry failed: ${result.error}`);
  reference = result.reference;
  const trackedResponse = await fetch(`${origin}/api/orders/track`, { method:'POST', headers:{ 'Content-Type':'application/json', 'Cookie':cookie, 'X-CSRF-Token':bootstrap.csrf }, body:JSON.stringify({ reference:result.reference, accessCode:result.accessCode }) });
  const tracked = await trackedResponse.json();
  if (!trackedResponse.ok || tracked.order?.id !== reference || tracked.order.items[0].options.lugWidthMm !== 20) throw new Error('Private follow-up failed');
  if (tracked.order.items[1]?.name !== 'Hand-stitched watch straps' || tracked.order.items[2]?.name !== "Women's bags" || tracked.order.items[2]?.options.wristMm !== null) throw new Error('Catalogue enquiry items were not preserved');
  if ('taper' in tracked.order.items[0].options || 'lining' in tracked.order.items[0].options) throw new Error('Unchosen specifications were stored');
  console.log('Legacy and catalogue enquiry items, private tracking, and item-specific fit notes passed.');
} finally {
  const db = new DatabaseSync('data/yellowcada.sqlite');
  if (reference) {
    db.prepare('DELETE FROM order_events WHERE order_id=?').run(reference);
    db.prepare('DELETE FROM orders WHERE id=?').run(reference);
  }
  db.prepare('DELETE FROM outbox WHERE recipient=?').run(email);
  db.close();
}
