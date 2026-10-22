import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { catalogProducts } from '../../data/catalogue';
import SectionHeading from '../common/SectionHeading';
import ProductCard from '../ui/ProductCard';
import Reveal from '../common/Reveal';
export default function ServicesSection() {
  return <section className="section-space py-16 md:py-24 xl:py-28 collection-section bg-cream" id="collection"><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><div className="section-top mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="The collection" title="Made for life around your watch." copy="Documented leathercraft, from strap work to everyday pieces."/><Link to="/products" className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3">View all products <ArrowUpRight size={17}/></Link></div><div className="product-grid grid auto-rows-fr grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{catalogProducts.filter(p => p.featured).map((product, index) => <Reveal key={product.id} className="h-full min-w-0" delay={index % 4}><ProductCard product={product} showVideoBadge={false}/></Reveal>)}</div><p className="collection-note mt-7 text-xs text-muted">Archive imagery documents past work; unverified social-media references are clearly labelled. Price, fit, material and availability are confirmed on enquiry.</p></div></section>;
}
