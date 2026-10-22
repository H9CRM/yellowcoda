import { ArrowUpRight, Check, Play, Scale, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import OptimizedImage from '../common/OptimizedImage';
import ReferenceProductCard from './ReferenceProductCard';

export default function ProductCard({ product, showVideoBadge = true }) {
  if (!product.image) return <ReferenceProductCard product={product}/>;
  return <PicturedProductCard product={product} showVideoBadge={showVideoBadge}/>;
}

function PicturedProductCard({ product, showVideoBadge }) {
  const { compare, toggleCompare, add } = useStore();
  const isCompared = compare.includes(product.id);
  const canCompare = isCompared || compare.length < 4;
  const path = `/products/${product.slug}`;
  return <article className="product-card flex h-full min-w-0 flex-col">
    <div className="group relative aspect-square overflow-hidden bg-sand">
      <Link className="block h-full" to={path} aria-label={`View ${product.name}`}>
        <OptimizedImage src={product.image} alt={product.imageAlt || product.name} width={800} height={800} className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.035]"/>
      </Link>
      <span className="absolute top-3 left-3 max-w-[calc(100%-4.5rem)] bg-paper/95 px-2.5 py-2 text-[.57rem] font-bold uppercase tracking-[.12em]">{product.verification === 'reference-to-confirm' ? 'Reference to confirm' : product.imageIsConcept ? 'Illustrative direction' : product.image ? 'From the archive' : 'Enquire for details'}</span>
      <button type="button" disabled={!canCompare} className={`absolute top-2.5 right-2.5 grid size-11 place-items-center rounded-full border border-white/80 bg-paper/95 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 ${isCompared ? 'text-gold-deep' : 'text-ink'}`} aria-pressed={isCompared} aria-label={`${isCompared ? 'Remove' : 'Add'} ${product.name} ${isCompared ? 'from' : 'to'} comparison`} title={canCompare ? (isCompared ? 'Remove from compare' : 'Compare product') : 'Compare up to 4 products'} onClick={() => toggleCompare(product.id)}>{isCompared ? <Check size={19}/> : <Scale size={19}/>}</button>
      {showVideoBadge && product.media?.length > 0 && <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-paper/95 px-2.5 py-1.5 text-[.65rem] font-semibold"><Play size={12} fill="currentColor"/> Video available</span>}
    </div>
    <div className="flex flex-1 flex-col pt-4">
      <p className="mb-1.5 text-[.62rem] font-semibold uppercase tracking-[.12em] text-muted">{product.category}</p>
      <h3 className="mb-2 font-serif text-[1.35rem] leading-tight sm:text-2xl"><Link to={path} className="transition-colors hover:text-gold-deep">{product.name}</Link></h3>
      <p className="mb-4 text-xs leading-relaxed text-muted">{product.shortDescription}</p>
      <div className="mt-auto border-t border-stone-200 pt-3 text-xs text-ink-soft">Price on request</div>
      <div className="mt-4 grid grid-cols-2 gap-2"><Link to={path} aria-label={`View ${product.name} details`} className="inline-flex min-h-11 items-center justify-center gap-1.5 border border-ink px-2 text-center text-xs font-semibold transition-colors hover:bg-ink hover:text-white">View <ArrowUpRight size={15}/></Link><button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => add(product.id)} className="inline-flex min-h-11 items-center justify-center gap-1.5 bg-ink px-2 text-center text-xs font-semibold text-white transition-colors hover:bg-gold-deep"><ShoppingBag size={15}/> Add to cart</button></div>
    </div>
  </article>;
}
