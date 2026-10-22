import { useEffect, useRef } from 'react';

export default function useModalFocus(active, dialogRef, onClose, inertRoot = false) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!active || !dialogRef.current) return;
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const originalOverflow = document.body.style.overflow;
    const root = inertRoot ? document.getElementById('root') : null;
    const originalInert = root?.inert;
    const originalHidden = root?.getAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    const selectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';
    const focusable = () => [...dialog.querySelectorAll(selectors)].filter(element => element.getClientRects().length);
    focusable()[0]?.focus();
    if (root) { root.inert = true; root.setAttribute('aria-hidden','true'); }
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current?.(); return; }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); dialog.focus(); return; }
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      else if (!dialog.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
      if (root) { root.inert = originalInert; if (originalHidden === null) root.removeAttribute('aria-hidden'); else root.setAttribute('aria-hidden',originalHidden); }
      previous?.focus?.();
    };
  }, [active, dialogRef, inertRoot]);
}
