import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { buttonClass } from '../components/common/buttonStyles';
import { formSurface, formField } from '../components/common/formStyles';
import { useStore } from '../hooks/useStore';
import { findBagProduct } from '../data/bag';
import { formatStrapDirection } from '../data/strapDirections';
import { webpageSchema } from '../utils/schemaHelpers';

export default function Checkout() {
  const { cart, clear } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const values = new FormData(event.currentTarget);
    const customer = { name:String(values.get('name') || ''), email:String(values.get('email') || ''), phone:String(values.get('phone') || ''), message:String(values.get('message') || '') };
    const items = cart.map(item => {
      const wrist = String(values.get(`wrist-${item.id}`) || '');
      return { productId:item.id, quantity:item.quantity, options:{ watch:String(values.get(`watch-${item.id}`) || ''), wristMm:wrist ? Number(wrist) : null, lugWidthMm:String(values.get(`lug-${item.id}`) || ''), preferences:String(values.get(`preferences-${item.id}`) || '') } };
    });
    const body = { items, customer, reviewConfirmed:values.has('reviewConfirmed'), website:String(values.get('website') || '') };
    try {
      const bootstrapResponse = await fetch('/api/bootstrap', { credentials:'same-origin' });
      if (!bootstrapResponse.ok) throw new Error('The enquiry service is unavailable. Start the included API server and try again.');
      const bootstrap = await bootstrapResponse.json();
      const response = await fetch('/api/enquiries', { method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json', 'X-CSRF-Token':bootstrap.csrf, 'Idempotency-Key':crypto.randomUUID() }, body:JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be sent.');
      setConfirmation(result);
      clear();
    } catch (caught) { setError(caught.message); }
    finally { setBusy(false); }
  }

  return <><SEO title="Complete Your Enquiry" path="/checkout" robots="noindex,follow" schema={webpageSchema('/checkout','Complete your enquiry','Send a YellowCada product enquiry without payment.')}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Enquiry bag',path:'/cart'},{name:'Send enquiry'}]}/></div>
    <section className="site-container mx-auto min-h-[500px] w-full max-w-7xl px-4 py-16 sm:px-7 md:px-10 md:py-24"><span className="text-xs font-bold uppercase tracking-[.18em] text-gold-deep">Your enquiry</span><h1 className="my-4 text-5xl sm:text-6xl">Let’s talk details.</h1>
      {confirmation ? <div className="my-8 max-w-3xl bg-[#e8eee2] p-7 sm:p-9"><h2 className="font-serif text-3xl">Enquiry received.</h2><p>YellowCada can review your selection and contact details. Save this reference and private access code.</p><p><strong>Reference:</strong> {confirmation.reference}</p><p><strong>Access code:</strong> <code>{confirmation.accessCode}</code></p>{!confirmation.emailConfigured && <p>Email delivery is not configured in this preview, so please save these details now.</p>}<Link className={buttonClass('dark')} to="/products">Explore more products <ArrowUpRight size={17}/></Link></div>
        : cart.length ? <div className="mt-9 grid gap-9 md:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)] md:gap-12"><form onSubmit={submit} aria-busy={busy} className={formSurface}><h2>Contact information</h2><div className="grid gap-x-4 sm:grid-cols-2"><label>Full name<input className={formField} name="name" autoComplete="name" required maxLength="100"/></label><label>Email address<input className={formField} name="email" type="email" autoComplete="email" required maxLength="254"/></label></div><label>Phone (optional)<input className={formField} name="phone" type="tel" autoComplete="tel" maxLength="30"/></label><h2>Your products and preferences</h2><p>Share details that help YellowCada identify each piece. The maker verifies every specification before a sale.</p>
          {cart.map(item => { const product = findBagProduct(item.id); if (!product) return null; const watchItem = product.category === 'Watch straps'; const legacyConcept = typeof item.id === 'number'; return <fieldset className="my-5 border border-stone-300 px-4 pb-3" key={item.id}><legend className="px-1 font-semibold">{item.quantity} × {product.name}</legend>{item.direction && <p className="text-xs leading-6 text-muted">Studio preview: {formatStrapDirection(item.direction)}. Confirm actual options with YellowCada.</p>}{watchItem && <div className="grid gap-x-4 sm:grid-cols-2"><label>Watch brand / model (optional)<input className={formField} name={`watch-${item.id}`} maxLength="150" placeholder="Exact reference if known"/></label><label>Wrist circumference in mm {legacyConcept ? '' : '(optional)'}<input className={formField} name={`wrist-${item.id}`} type="number" min="127" max="203.2" step="0.1" required={legacyConcept} placeholder="127–203.2"/></label><label>Lug width in mm (optional)<input className={formField} name={`lug-${item.id}`} type="number" min="10" max="40" step="0.1" placeholder="Measure between the lugs"/></label></div>}<label>Preferred material, colour, source link or fit notes (optional)<textarea className={`${formField} resize-y`} name={`preferences-${item.id}`} rows="3" maxLength="500" defaultValue={item.direction ? `Studio preview: ${formatStrapDirection(item.direction)}. Please confirm which options can be made.` : ''} placeholder="Share the archive post or details you have in mind"/></label></fieldset>; })}
          <label>Other details<textarea className={`${formField} resize-y`} name="message" rows="4" maxLength="1200" placeholder="Anything else YellowCada should know?"/></label><label className="flex flex-row items-start gap-3 text-sm leading-relaxed"><input className="mt-1 size-4 shrink-0 accent-ink" type="checkbox" name="reviewConfirmed" required/><span>I have reviewed this selection and understand it is an enquiry, with no payment or confirmed order.</span></label><label className="sr-only" aria-hidden="true">Website<input className={formField} name="website" tabIndex="-1" autoComplete="off"/></label>{error && <p className="mt-4 text-xs text-red-700" role="alert">{error}</p>}<button type="submit" disabled={busy} className={buttonClass('dark')}>{busy ? 'Sending enquiry…' : 'Send enquiry · no payment'} <ArrowUpRight size={17}/></button><p className="mt-5 text-xs leading-relaxed text-muted">Your details are stored for this enquiry. Read the <Link to="/privacy" className="underline underline-offset-4">enquiry data notice</Link>.</p></form>
          <aside className="self-start bg-[#ebeee5] p-6 sm:p-8"><h2 className="font-serif text-3xl">Your selection</h2>{cart.map(item => { const product = findBagProduct(item.id); return <div className="flex justify-between gap-3 border-t border-stone-300 py-4 text-xs" key={item.id}><span>{item.quantity} × {product?.name}</span><strong className="shrink-0">On request</strong></div>; })}<p className="text-sm leading-7 text-muted">The atelier confirms actual materials, fit, price and availability before accepting a purchase.</p><Link to="/cart" className="inline-flex min-h-11 items-center border-b border-current text-sm font-semibold">Edit your bag</Link></aside></div>
        : <div className="my-8 bg-[#eceedf] px-8 py-12 text-center md:py-20"><h2 className="font-serif text-3xl">Your bag is empty.</h2><p>Choose a product first.</p><Link to="/products" className={buttonClass('dark')}>Explore products <ArrowUpRight size={17}/></Link></div>}</section></>;
}
