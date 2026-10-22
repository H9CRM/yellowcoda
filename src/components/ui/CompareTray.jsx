import { Scale, X } from 'lucide-react';
import { catalogProducts } from '../../data/catalogue';
import { useStore } from '../../hooks/useStore';

export default function CompareTray() {
  const { compare, toggleCompare, clearCompare, setCompareOpen } = useStore();
  if (!compare.length) return null;
  const selected = compare.map(id => catalogProducts.find(item => item.id === id)).filter(Boolean);
  if (!selected.length) return null;
  return <aside className="fixed inset-x-0 bottom-0 z-[65] border-t border-gold-light bg-ink text-white shadow-soft" aria-label="Selected products to compare"><div className="site-container mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-7 md:px-10"><div className="flex items-center gap-2 text-xs"><Scale size={17}/><strong>Compare products</strong><span className="text-white/70">{selected.length} of 4</span></div><div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">{selected.map(product => <button key={product.id} type="button" onClick={() => toggleCompare(product.id)} aria-label={`Remove ${product.name} from comparison`} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 border border-white/25 px-2 text-[.68rem]">{product.image && <img src={product.image} alt="" width="27" height="27" className="size-7 object-cover"/>}{product.name}<X size={13}/></button>)}</div><button type="button" className="min-h-10 text-xs underline underline-offset-4" onClick={clearCompare}>Clear</button><button type="button" disabled={selected.length < 2} className="min-h-11 bg-gold-pale px-4 text-xs font-semibold text-ink disabled:opacity-60" onClick={() => setCompareOpen(true)}>{selected.length < 2 ? 'Add one more' : 'Compare now'}</button></div></aside>;
}
