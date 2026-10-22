import { ArrowUpRight, Ruler, Layers3, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import Reveal from '../common/Reveal';
export default function WhyChooseUs() {
  const details = [
    { icon: Ruler, title: 'Fit first', copy: 'Start with your watch reference, lug width and wrist measurement. Each unusual attachment deserves a careful check.' },
    { icon: Layers3, title: 'Material matters', copy: 'Explore leather texture, lining and construction with the exact material confirmed for your chosen strap.' },
    { icon: Feather, title: 'Your finish', copy: 'Consider colour, padding and stitch contrast to make the strap feel at home on your wrist.' }
  ];
  return <section className="section-space py-16 md:py-24 xl:py-28 why-section bg-[#edeee6]"><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><div className="section-top mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="Why YellowCada" title="Less noise. More character." copy="The small choices are what turn a strap into your strap."/><Link to="/about#craft" className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3">Explore the craft <ArrowUpRight size={17}/></Link></div><div className="feature-grid grid gap-4 sm:grid-cols-3">{details.map(({icon:Icon,title,copy},i) => <Reveal as="article" delay={i} className="feature-card relative min-h-60 border border-stone-200 bg-paper p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none md:p-10" key={title}><span className="feature-number absolute top-7 right-7 font-serif text-2xl text-stone-400">0{i+1}</span><Icon className="mb-7 text-muted" size={31} strokeWidth={1.35} aria-hidden="true"/><h3 className="mb-3 font-serif text-2xl">{title}</h3><p className="m-0 text-sm leading-relaxed text-muted">{copy}</p></Reveal>)}</div></div></section>;
}
