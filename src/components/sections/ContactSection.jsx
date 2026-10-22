import { buttonClass } from '../common/buttonStyles';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function ContactSection() { return <div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 contact-strip flex flex-col gap-5 py-14 md:flex-row md:items-center md:justify-between md:py-20"><div><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">A good fit begins with a conversation</span><h2>Have a watch in mind?</h2><p>Share the details and let the atelier guide the next step.</p></div><Link to="/contact" className={buttonClass('outline')}>Ask about your strap <ArrowUpRight size={17}/></Link></div>; }
