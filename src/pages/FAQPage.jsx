import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import FAQ from '../components/common/FAQ';
import CTA from '../components/common/CTA';
import { faqSchema, webpageSchema, breadcrumbSchema } from '../utils/schemaHelpers';
import { faqs } from '../data/faqs';
const description = 'Answers about YellowCada handmade watch straps, fit, leather options, production and how to request a custom piece.';
export default function FAQPage() { return <><SEO title="Watch Strap FAQs" path="/faq" description={description} schema={[webpageSchema('/faq','YellowCada FAQs',description),faqSchema(faqs),breadcrumbSchema([{name:'Home',path:'/'},{name:'FAQs',path:'/faq'}])]}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'FAQs'}]}/></div><section className="page-intro pt-16 pb-12 md:pt-24 md:pb-20 site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Your questions</span><h1>Answers before you decide.</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> Share the exact watch and fit details first. YellowCada can then confirm suitable materials, construction, timing, availability and price for your enquiry.</p></section><FAQ entries={faqs}/><CTA/></>; }
