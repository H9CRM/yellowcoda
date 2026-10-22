import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import { buttonClass } from './buttonStyles';
import { formField } from './formStyles';
import SEO from '../seo/SEO';
import FAQ from './FAQ';
import { webpageSchema, faqSchema } from '../../utils/schemaHelpers';

const questions = [
  { question: 'How do I send an enquiry?', answer: 'Copy your product details and send them to YellowCada through its official Instagram or Facebook account. Opening a channel does not send a message automatically.' },
  { question: 'Can I place or track an order on this website?', answer: 'This catalogue takes no payment and does not record orders. Confirm materials, fit, price, delivery and progress directly with YellowCada.' }
];

export default function DirectEnquiry({ path = '/contact', draft = '', tracking = false }) {
  const [message, setMessage] = useState(draft);
  const [status, setStatus] = useState('');
  const title = tracking ? 'Follow up with YellowCada' : 'Start a conversation';
  async function copy() {
    try { await navigator.clipboard.writeText(message); setStatus('Copied. Open an official channel and paste your enquiry when you are ready.'); }
    catch { setStatus('Select the text above and copy it, then paste it into an official channel.'); }
  }
  return <><SEO title={title} path={path} robots={path === '/contact' ? undefined : 'noindex,follow'} description="Discuss handmade watch straps and leather goods directly with YellowCada through its official channels." schema={[webpageSchema(path, title, 'Contact YellowCada directly about fit, materials, availability and delivery.'), faqSchema(questions)]}/>
    <section className="site-container mx-auto w-full max-w-5xl px-4 py-16 sm:px-7 md:px-10 md:py-24">
      <span className="eyebrow text-xs font-bold uppercase tracking-[.18em] text-gold-deep">The atelier</span>
      <h1 className="my-5 text-5xl sm:text-6xl">{tracking ? 'Keep the conversation going.' : 'Start a conversation.'}</h1>
      <p className="answer-block max-w-3xl text-lg leading-relaxed text-muted">{tracking ? 'Ask YellowCada for an update through the official channel where you discussed your piece. Include your existing reference, if you have one.' : 'Share your selected pieces, watch model, measured lug width and preferred leather with YellowCada. The maker confirms fit, materials, price and delivery directly.'}</p>
      <div className="my-9 bg-sand p-6 sm:p-9"><h2 className="font-serif text-3xl">{tracking ? 'Follow up directly' : 'Prepare your enquiry'}</h2>
        <p>This website keeps your bag on this device. Messages are sent through the official channels below; no enquiry is submitted here.</p>
        {!tracking && <><label className="block text-sm font-semibold" htmlFor="direct-enquiry">Your message<textarea id="direct-enquiry" className={`${formField} mt-3 min-h-56 w-full resize-y`} rows="8" value={message} onChange={event => setMessage(event.target.value)} placeholder="Hello YellowCada, I would like to ask about…"/></label><button type="button" disabled={!message.trim()} onClick={copy} className={`${buttonClass('outline')} my-5`}>Copy enquiry</button><p role="status" className="text-sm">{status}</p></>}
        <div className="mt-5 flex flex-wrap gap-4"><a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className={buttonClass('dark')}>Open Instagram ↗</a><a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className={buttonClass('outline')}>Open Facebook ↗</a></div>
      </div>
      <p>Every piece is discussed individually. No payment is collected on this site. <Link to="/products" className="underline underline-offset-4">Explore products</Link> or read the <Link to="/privacy" className="underline underline-offset-4">enquiry data notice</Link>.</p>
    </section><FAQ entries={questions}/></>;
}
