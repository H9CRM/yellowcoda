import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productGuidance } from '../../data/productGuidance';

const steps = [
  ['01','Send a reference','Select this product or an archive photograph, then provide your measurements, preferences and delivery destination in the enquiry.'],
  ['02','Confirm the specification','Ask YellowCada to confirm what can be made, the material, fit, price and expected production time for your request.'],
  ['03','Agree the delivery details','Before committing to an order, confirm the available delivery method, destination, shipping charge and estimated arrival directly with the maker.'],
];

export default function ProductEnquiryGuide({ product }) {
  const guide = productGuidance(product);
  return <section className="bg-[#eceae2] py-16 md:py-24" aria-labelledby="product-enquiry-guide-title">
    <div className="site-container mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-7 md:px-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
      <div>
        <span className="text-[.67rem] font-bold uppercase tracking-[.18em] text-gold-deep">Product details</span>
        <h2 id="product-enquiry-guide-title" className="mb-5 mt-3 max-w-xl font-serif text-[clamp(2.4rem,4vw,4.2rem)] leading-[1.06]">{guide.heading}.</h2>
        <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">{guide.intro}</p>
        <h3 className="mb-3 mt-8 font-serif text-2xl">Helpful details to send</h3>
        <ul className="m-0 max-w-xl list-none space-y-3 p-0">{guide.questions.map((question,index) => <li key={question} className="flex gap-3 border-t border-ink/10 pt-3 text-sm leading-6 text-ink-soft"><span className="shrink-0 text-xs font-bold text-gold-deep">0{index+1}</span><span>{question}</span></li>)}</ul>
      </div>
      <div className="bg-paper p-6 shadow-[0_18px_55px_rgba(28,33,27,.07)] sm:p-9">
        <span className="text-[.67rem] font-bold uppercase tracking-[.18em] text-gold-deep">Enquiry & delivery</span>
        <h2 className="mb-2 mt-3 font-serif text-3xl sm:text-4xl">How the next steps work.</h2>
        <p className="mb-6 text-sm leading-7 text-muted">This website collects your preferences for a conversation. YellowCada confirms the final order and delivery terms directly.</p>
        <ol className="m-0 list-none space-y-0 p-0">{steps.map(([number,title,copy]) => <li key={number} className="grid grid-cols-[2.2rem_1fr] gap-3 border-t border-stone-200 py-5"><span className="pt-1 text-xs font-bold text-gold-deep">{number}</span><div><h3 className="mb-1 font-serif text-xl">{title}</h3><p className="mb-0 text-sm leading-6 text-muted">{copy}</p></div></li>)}</ol>
        <p className="mt-1 text-xs leading-6 text-muted">No delivery region, courier, charge or arrival date is guaranteed by this website. No payment is taken here.</p>
        <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-ink text-xs font-bold transition-[gap] hover:gap-3">Enquire about {product.name} <ArrowUpRight size={15}/></Link>
      </div>
    </div>
  </section>;
}
