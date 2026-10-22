import { ArrowUpRight, Check, ImageOff, Scale, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';

export default function ReferenceProductCard({ product }) {
  const { compare, toggleCompare, add } = useStore();
  const isCompared = compare.includes(product.id);
  const canCompare = isCompared || compare.length < 4;
  return <article className="flex min-w-0 flex-col border border-stone-200 bg-paper p-5 shadow-[0_14px_35px_rgba(23,32,27,.04)] sm:p-6">
    <div className="mb-8 flex items-start justify-between gap-4"><span className="inline-flex items-center gap-2 text-[.62rem] font-bold uppercase tracking-[.14em] text-gold-deep"><ImageOff size={15}/> Image to confirm</span><button type="button" disabled={!canCompare} aria-pressed={isCompared} aria-label={`${isCompared ? 'Remove' : 'Add'} ${product.name} ${isCompared ? 'from' : 'to'} comparison`} title={canCompare ? 'Compare product' : 'Compare up to 4 products'} onClick={() => toggleCompare(product.id)} className={`grid size-11 shrink-0 place-items-center rounded-full border border-stone-300 transition-colors hover:border-ink disabled:opacity-50 ${isCompared ? 'bg-ink text-white' : 'text-ink'}`}>{isCompared ? <Check size={18}/> : <Scale size={18}/>}</button></div>
    <p className="mb-2 text-[.62rem] font-semibold uppercase tracking-[.15em] text-muted">{product.category}</p>
    <h3 className="mb-4 font-serif text-2xl leading-tight sm:text-[1.75rem]"><Link to={`/products/${product.slug}`} className="hover:text-gold-deep">{product.name}</Link></h3>
    <p className="mb-5 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
    <p className="mt-auto border-t border-stone-200 pt-4 text-xs text-ink-soft">Price and current imagery on request</p>
    <div className="mt-5 grid grid-cols-2 gap-2"><Link to={`/products/${product.slug}`} className="inline-flex min-h-11 items-center justify-center gap-1 border border-ink px-2 text-xs font-semibold transition-colors hover:bg-ink hover:text-white">View <ArrowUpRight size={14}/></Link><button type="button" onClick={() => add(product.id)} aria-label={`Add ${product.name} to cart`} className="inline-flex min-h-11 items-center justify-center gap-1 bg-ink px-2 text-xs font-semibold text-white transition-colors hover:bg-gold-deep"><ShoppingBag size={14}/> Add to bag</button></div>
  </article>;
}
