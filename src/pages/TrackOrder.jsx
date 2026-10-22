import { buttonClass } from '../components/common/buttonStyles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { formSurface, formField } from '../components/common/formStyles';
import { webpageSchema } from '../utils/schemaHelpers';

export default function TrackOrder() {
  const [result,setResult] = useState(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setResult(null);
    const values = new FormData(event.currentTarget);
    try {
      const bootstrapResponse = await fetch('/api/bootstrap', { credentials:'same-origin' });
      if (!bootstrapResponse.ok) throw new Error('The enquiry service is unavailable.');
      const bootstrap = await bootstrapResponse.json();
      const response = await fetch('/api/orders/track', { method:'POST', credentials:'same-origin', headers:{ 'Content-Type':'application/json', 'X-CSRF-Token':bootstrap.csrf }, body:JSON.stringify({ reference:String(values.get('reference') || '').trim(), accessCode:String(values.get('accessCode') || '').trim() }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not find this enquiry.');
      setResult(body.order);
    } catch (caught) { setError(caught.message); }
    finally { setBusy(false); }
  }
  return <><SEO title="Track Your Enquiry" path="/track-order" robots="noindex,nofollow" schema={webpageSchema('/track-order','Track your YellowCada enquiry','Use your private reference and access code to see its recorded status.')}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Track enquiry'}]}/></div><section className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 track-page max-w-3xl section-space py-16 md:py-24 xl:py-28"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Private follow-up</span><h1>Check your enquiry.</h1><p>Enter the reference and private access code shown after submission. Keep the code to yourself; it unlocks the details of your request.</p><form className={formSurface} aria-busy={busy} onSubmit={submit}><label>Reference<input className={formField} name="reference" required maxLength="30" autoComplete="off" placeholder="YC-…"/></label><label>Private access code<input className={formField} name="accessCode" required minLength="64" maxLength="64" autoComplete="off"/></label><p className="form-error mt-4 text-xs text-red-700" role="alert">{error}</p><button className={buttonClass('dark')} type="submit" disabled={busy}>{busy ? 'Checking…' : 'Check status'} <ArrowUpRight size={16}/></button></form>{result && <div className="track-result my-8 bg-[#e7ecdf] p-7" role="status"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Recorded request</span><h2>{result.id}</h2><p><strong>Status:</strong> {result.status.replaceAll('_',' ')}</p><p><strong>Type:</strong> {result.kind}</p><p><strong>Designs:</strong> {result.items.map(item => `${item.quantity} × ${item.name}`).join(', ')}</p><p>This status is a record of the enquiry. Final product details and price are confirmed directly by YellowCada.</p></div>}<p className="track-help">Lost your access code? <Link to="/contact">Send a new message</Link> from the same email address so the atelier can help.</p></section></>;
}
