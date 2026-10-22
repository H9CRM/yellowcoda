import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useModalFocus from '../../hooks/useModalFocus';

export default function OffCanvas({ open, onClose, title, eyebrow, description, side = 'right', children, id }) {
  const dialogRef = useRef(null);
  useModalFocus(open, dialogRef, onClose, true);
  if (!open) return null;
  const position = side === 'bottom'
    ? 'inset-x-0 bottom-0 max-h-[88dvh] w-full rounded-t-2xl motion-safe:animate-[sheet-in_260ms_ease-out_both]'
    : side === 'left'
      ? 'inset-y-0 left-0 h-[100dvh] w-[min(100vw,430px)] motion-safe:animate-[drawer-left-in_280ms_ease-out_both]'
      : 'inset-y-0 right-0 h-[100dvh] w-[min(100vw,430px)] motion-safe:animate-[drawer-in_280ms_ease-out_both]';
  return createPortal(<div className="fixed inset-0 z-[100] bg-ink/70 motion-safe:animate-[overlay-in_200ms_ease-out_both]" onClick={onClose}>
    <aside id={id} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabIndex="-1" className={`absolute flex flex-col overflow-hidden bg-paper text-ink shadow-2xl ${position}`} onClick={event => event.stopPropagation()}>
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-7"><div className="min-w-0">{eyebrow && <p className="mb-2 text-[.66rem] font-bold uppercase tracking-[.17em] text-gold-deep">{eyebrow}</p>}<h2 id={`${id}-title`} className="mb-0 font-serif text-3xl">{title}</h2>{description && <p className="mb-0 mt-2 text-sm leading-relaxed text-muted">{description}</p>}</div><button type="button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} className="grid size-11 min-w-11 place-items-center rounded-full border border-stone-300 transition-colors hover:bg-sand"><X size={20}/></button></div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">{children}</div>
    </aside>
  </div>, document.body);
}
