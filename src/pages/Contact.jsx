import { sitePath } from '../utils/sitePath';
import { buttonClass } from '../components/common/buttonStyles';
import { useState } from 'react';
import DirectEnquiry from '../components/common/DirectEnquiry';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Instagram, Facebook, Youtube } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { formSurface, formField } from '../components/common/formStyles';
import FAQ from '../components/common/FAQ';
import { siteConfig } from '../data/siteConfig';
import { webpageSchema, breadcrumbSchema, faqSchema } from '../utils/schemaHelpers';
import { faqs } from '../data/faqs';
const description = 'Contact YellowCada about handmade leather watch straps, sizing, leather options and small leather goods.';
export default function Contact() {
  const [params] = useSearchParams();
  const productName = params.get('product')?.slice(0, 100) || '';
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  if (siteConfig.staticHosting) return <DirectEnquiry draft={productName ? `Hello YellowCada, I would like to ask about ${productName}.` : ''}/>;
  async function submit(event) {
    event.preventDefault(); setBusy(true); setStatus('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const bootstrap = await fetch('/api/bootstrap', { credentials: 'same-origin' }).then(r => r.json());
      const response = await fetch('/api/contact', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': bootstrap.csrf }, body: JSON.stringify({ ...values, kind: 'contact' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your enquiry.');
      setStatus(`Your message was saved. Reference: ${result.reference}.`); form.reset();
    } catch (error) { setStatus(`${error.message} You can also reach YellowCada on Instagram.`); }
    finally { setBusy(false); }
  }
  return <><SEO title="Contact YellowCada" path="/contact" description={description} schema={[webpageSchema('/contact','Contact YellowCada',description),breadcrumbSchema([{name:'Home',path:'/'},{name:'Contact',path:'/contact'}]),faqSchema(faqs.slice(0,2))]}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Contact'}]}/></div><section className="page-intro pt-16 pb-12 md:pt-24 md:pb-20 site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Contact the atelier</span><h1>Start a conversation.</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> Tell YellowCada about your watch, the strap or leather good you have in mind and any relevant measurements. The maker can confirm the next step.</p></section><section className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 contact-grid grid gap-9 md:grid-cols-2 md:gap-16 section-space py-16 md:py-24 xl:py-28"><form onSubmit={submit} aria-busy={busy} className={formSurface}><h2>Your enquiry</h2><p>Use the form for sizing, material and availability questions. A message is an enquiry, not an order.</p><div className="form-row grid gap-x-4 sm:grid-cols-2"><label>Full name<input className={formField} name="name" autoComplete="name" required maxLength="100"/></label><label>Email address<input className={formField} name="email" type="email" autoComplete="email" required maxLength="254"/></label></div><label>Phone (optional)<input className={formField} name="phone" type="tel" autoComplete="tel" maxLength="30"/></label><label>What can we help with?<textarea className={`${formField} resize-y`} name="message" rows="6" required maxLength="1200" defaultValue={productName ? `I would like to ask about ${productName}. ` : ''} placeholder="Include your watch model, measured lug width and any preferred leather or colour."/></label><label className="sr-only" aria-hidden="true">Website<input className={formField} name="website" tabIndex="-1" autoComplete="off"/></label><button disabled={busy} className={buttonClass('dark')} type="submit">{busy ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17}/></button><p className="privacy-note mt-5 text-xs leading-relaxed text-muted">How we handle your details: <a href={sitePath("/privacy")} className="underline underline-offset-4">enquiry data notice</a>.</p><p role="status" className="form-status mt-4 text-xs text-muted">{status}</p></form><aside className="contact-aside self-start bg-[#e9ede3] p-8 md:p-12"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Follow the work</span><h2>Explore the official channels.</h2><p>Browse recent Instagram work and the YouTube video archive. Facebook is also linked for updates.</p><div className="contact-socials flex flex-wrap gap-3"><a href={sitePath(siteConfig.instagram)} target="_blank" rel="noreferrer" className={buttonClass('outline')}><Instagram size={18}/> Instagram <ArrowUpRight size={16}/></a><a href={sitePath(siteConfig.facebook)} target="_blank" rel="noreferrer" className={buttonClass('outline')}><Facebook size={18}/> Facebook <ArrowUpRight size={16}/></a><a href={sitePath(siteConfig.youtube)} target="_blank" rel="noreferrer" className={buttonClass('outline')}><Youtube size={18}/> YouTube <ArrowUpRight size={16}/></a></div><div className="aside-note mt-16 border-t border-stone-300 pt-6"><strong>Before you write</strong><p>A watch reference and actual measurements help the maker assess fit. Unverified model compatibility is reviewed individually.</p></div></aside></section><FAQ entries={faqs.slice(0,2)}/></>;
}
