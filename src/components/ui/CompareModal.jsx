import { sitePath } from '../../utils/sitePath';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X } from 'lucide-react';
import { catalogProducts } from '../../data/catalogue';
import { useStore } from '../../hooks/useStore';
import useModalFocus from '../../hooks/useModalFocus';

export default function CompareModal() {
  const { compare, compareOpen, setCompareOpen, toggleCompare, clearCompare } = useStore();
  const ref = useRef(null);
  const selected = compare.map(id => catalogProducts.find(product => product.id === id)).filter(Boolean);
  const close = () => setCompareOpen(false);
  useModalFocus(compareOpen, ref, close);
  if (!compareOpen) return null;
  const rows = [
    ['Category', product => product.category],
    ['Documented material', product => product.materials?.join(', ') || 'Ask the maker'],
    ['Use', product => product.applications?.join(', ') || 'Ask the maker'],
    ['Illustrative colour directions', product => product.variants?.length ? `${product.variants.map(item => item.name).join(', ')} (concepts only; confirm real options)` : 'No colour options verified in this archive'],
    ['Fit or dimensions', product => product.category === 'Watch straps' ? 'Confirm watch reference, lug width and wrist measurement' : 'Confirm current dimensions with YellowCada'],
    ['Archived reels', product => String(product.media.filter(item => item.mediaType === 'Instagram reel').length)],
    ['YouTube videos', product => String(product.media.filter(item => item.mediaType === 'YouTube video').length)],
    ['Turnaround', () => 'Current estimate on enquiry'],
    ['Price', () => 'On request'],
  ];
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/70 p-0 motion-safe:animate-[overlay-in_220ms_ease-out_both] sm:items-center sm:p-4" onClick={close}>
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="compare-modal-title" className="max-h-[100dvh] w-full max-w-6xl overflow-y-auto bg-paper p-5 motion-safe:animate-[dialog-in_260ms_ease-out_both] sm:max-h-[90dvh] sm:p-8" onClick={event => event.stopPropagation()}>
      <div className="mb-6 flex items-start justify-between gap-5"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.15em] text-gold-deep">Side by side</p><h2 id="compare-modal-title" className="mb-2 text-3xl sm:text-5xl">Compare products</h2><p className="mb-0 text-sm leading-relaxed text-muted">Compare documented uses and archive evidence. Fit, exact materials, availability and price are confirmed on enquiry.</p></div><button type="button" className="grid size-11 min-w-11 place-items-center rounded-full border border-stone-300" aria-label="Close comparison" onClick={close}><X size={20}/></button></div>
      {selected.length ? <div className="overflow-x-auto border border-stone-200" role="region" aria-label="Product comparison" tabIndex="0"><table className="w-full min-w-[680px] border-collapse text-left text-xs"><caption className="sr-only">Comparison of selected YellowCada products</caption><thead><tr><th className="w-32 border-b border-stone-200 bg-sand p-4" scope="col">Detail</th>{selected.map(product => <th key={product.id} scope="col" className="min-w-36 border-b border-l border-stone-200 p-4 align-top"><div className="flex items-start justify-between gap-2"><Link to={`/products/${product.slug}`} onClick={close} className="font-serif text-lg font-normal underline underline-offset-4">{product.name}</Link><button type="button" className="grid size-8 min-w-8 place-items-center" aria-label={`Remove ${product.name}`} onClick={() => toggleCompare(product.id)}><X size={16}/></button></div>{product.image && <img src={sitePath(product.image)} alt={product.imageAlt || product.name} width="120" height="120" loading="lazy" className="mt-3 aspect-square w-24 object-cover"/>}</th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row" className="border-b border-stone-200 bg-sand p-4 font-semibold">{label}</th>{selected.map(product => <td key={product.id} className="border-b border-l border-stone-200 p-4 align-top">{value(product)}</td>)}</tr>)}</tbody></table></div> : <p>No products selected. Add products from the catalogue to compare them.</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4"><Link to={`/contact?product=${encodeURIComponent(selected.map(product => product.name).join(', '))}`} onClick={close} className="inline-flex min-h-11 items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold text-white">Ask about these products</Link><button type="button" className="min-h-11 text-xs font-semibold underline underline-offset-4" onClick={() => { clearCompare(); close(); }}>Clear comparison</button><span className="ml-auto inline-flex items-center gap-2 text-xs text-muted"><Scale size={16}/>{selected.length} of 4 selected</span></div>
    </div>
  </div>;
}
