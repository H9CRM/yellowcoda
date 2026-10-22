import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useModalFocus from '../../hooks/useModalFocus';

export default function ImageLightbox({ items, index, onIndexChange, onClose }) {
  const ref = useRef(null);
  const touchStart = useRef(null);
  useModalFocus(index >= 0, ref, onClose);
  useEffect(() => {
    if (index < 0) return;
    const onKey = event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); onIndexChange((index - 1 + items.length) % items.length); }
      if (event.key === 'ArrowRight') { event.preventDefault(); onIndexChange((index + 1) % items.length); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, items.length, onIndexChange]);
  if (index < 0 || !items[index]) return null;
  const item = items[index];
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-2 motion-safe:animate-[overlay-in_220ms_ease-out_both] sm:p-5" onClick={onClose}>
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="image-lightbox-title" className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden bg-paper shadow-2xl" onClick={event => event.stopPropagation()}>
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-4 py-3 sm:px-6"><p className="m-0 text-[.68rem] font-semibold uppercase tracking-[.16em] text-muted">{index + 1} of {items.length} · {item.kind}</p><button type="button" onClick={onClose} aria-label="Close image" className="grid size-11 min-w-11 place-items-center rounded-full border border-stone-300"><X size={20}/></button></div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#171b17] p-2 sm:p-5" onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={event => { if (touchStart.current === null) return; const delta = event.changedTouches[0]?.clientX - touchStart.current; if (Math.abs(delta) > 50) onIndexChange((index + (delta < 0 ? 1 : -1) + items.length) % items.length); touchStart.current=null; }}>
        <img src={item.image} alt={item.alt} width="1080" height="1080" className="max-h-[68dvh] max-w-full object-contain"/>
        <button type="button" onClick={() => onIndexChange((index - 1 + items.length) % items.length)} aria-label="Previous image" className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink sm:left-5"><ChevronLeft size={22}/></button>
        <button type="button" onClick={() => onIndexChange((index + 1) % items.length)} aria-label="Next image" className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink sm:right-5"><ChevronRight size={22}/></button>
      </div>
      <div className="max-h-[22dvh] overflow-y-auto px-4 py-4 sm:px-6"><h2 id="image-lightbox-title" className="m-0 font-serif text-2xl">{item.title}</h2><p className="mb-2 mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{item.caption || item.kind}</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">{item.productSlug && <Link to={`/products/${item.productSlug}`} onClick={onClose} className="underline underline-offset-4">View {item.productName}</Link>}{item.detailPath && <Link to={item.detailPath} onClick={onClose} className="underline underline-offset-4">Image details</Link>}{item.source && <a href={item.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">Original post</a>}</div></div>
    </div>
  </div>;
}
