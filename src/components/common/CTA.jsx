import Button from './Button';
export default function CTA() {
  return <section className="cta-band bg-ink-soft py-14 text-paper md:py-24"><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 cta-inner flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between"><div><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Made personal</span><h2>It starts with your watch.</h2><p>Tell YellowCada about the watch, the fit and the finish you have in mind.</p></div><Button to="/contact" variant="gold">Talk to the atelier <span aria-hidden="true">↗</span></Button></div></section>;
}
