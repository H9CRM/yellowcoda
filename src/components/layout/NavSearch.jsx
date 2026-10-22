import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { searchSite, searchTypes } from '../../data/searchIndex';

const popular = ['Watch straps', 'Wallets', 'Leather belts', 'How to measure'];

export default function NavSearch({ open, setOpen, onOpen, scrolled }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [limit, setLimit] = useState(8);
  const [panelPosition, setPanelPosition] = useState(null);
  const rootRef = useRef(null);
  const desktopTriggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  const focusMobileRef = useRef(false);
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const results = useMemo(() => searchSite(query, type), [query, type]);
  const shown = results.slice(0, limit);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = event => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const onKeyDown = event => { if (event.key === 'Escape') { setOpen(false); desktopInputRef.current?.blur(); mobileInputRef.current?.blur(); } };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) { setPanelPosition(null); focusMobileRef.current = false; return; }
    const positionPanel = () => {
      const desktopVisible = desktopTriggerRef.current && getComputedStyle(desktopTriggerRef.current).display !== 'none';
      const trigger = desktopVisible ? desktopTriggerRef.current : mobileTriggerRef.current;
      const icon = trigger?.querySelector('svg');
      if (!trigger || !icon) return;
      const triggerRect = trigger.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const width = Math.min(544, viewportWidth - 24);
      const iconCenter = iconRect.left + iconRect.width / 2;
      const left = Math.max(12, Math.min(iconCenter - 24, viewportWidth - width - 12));
      const top = triggerRect.bottom + 8;
      const visibleHeight = window.visualViewport?.height || window.innerHeight;
      setPanelPosition({ left:left - rootRect.left, width, maxHeight:Math.max(120, Math.min(448, visibleHeight - top - 12)), '--search-anchor-x':`${Math.max(18, Math.min(width - 18, iconCenter - left))}px` });
    };
    positionPanel();
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel, { passive:true });
    window.visualViewport?.addEventListener('resize', positionPanel);
    return () => {
      window.removeEventListener('resize', positionPanel);
      window.removeEventListener('scroll', positionPanel);
      window.visualViewport?.removeEventListener('resize', positionPanel);
    };
  }, [open, scrolled]);

  useEffect(() => {
    if (open && panelPosition && focusMobileRef.current) {
      mobileInputRef.current?.focus();
      focusMobileRef.current = false;
    }
  }, [open, panelPosition]);

  const show = () => { onOpen(); setOpen(true); };
  const choose = () => { setOpen(false); setQuery(''); setType('All'); setLimit(8); };
  const submitFirst = event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); resultsRef.current?.querySelector('[data-search-result]')?.focus(); }
    if (event.key === 'Enter' && results[0]) { event.preventDefault(); navigate(results[0].href); choose(); }
  };
  const moveWithinResults = event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = [...resultsRef.current.querySelectorAll('[data-search-result]')];
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    links[Math.max(0, Math.min(links.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus();
  };
  const updateQuery = value => { setQuery(value); setLimit(8); setType('All'); show(); };

  return <div ref={rootRef} className="nav-search-root relative order-first nav:order-none">
    <div ref={desktopTriggerRef} className={`hidden items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-3 transition-[width,background-color,border-color] duration-300 focus-within:border-gold-deep focus-within:bg-white nav:flex ${scrolled ? 'w-40 xl:w-48' : 'w-44 xl:w-56'}`}>
      <Search size={17} className="shrink-0 text-gold-deep" aria-hidden="true"/>
      <label htmlFor="nav-search-desktop" className="sr-only">Search YellowCada</label>
      <input ref={desktopInputRef} id="nav-search-desktop" type="search" autoComplete="off" value={query} onFocus={show} onChange={event => updateQuery(event.target.value)} onKeyDown={submitFirst} aria-controls="nav-search-panel" aria-expanded={open} placeholder="Search the atelier" className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"/>
    </div>
    <button ref={mobileTriggerRef} type="button" aria-label="Search YellowCada" aria-controls="nav-search-panel" aria-expanded={open} onClick={() => { focusMobileRef.current = true; show(); }} className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/70 nav:hidden"><Search size={20} strokeWidth={1.8}/></button>
    {open && panelPosition && <div id="nav-search-panel" role="region" aria-label="Search suggestions" style={panelPosition} className="nav-search-panel absolute top-[calc(100%+8px)] z-50 flex flex-col overflow-hidden border border-stone-200 bg-paper shadow-[0_22px_55px_rgba(23,32,27,.22)]">
      <div className="border-b border-stone-200 px-4 pb-3 pt-4 nav:px-5">
        <div className="mb-2 flex items-center justify-between gap-3"><span className="text-[.66rem] font-bold uppercase tracking-[.17em] text-gold-deep">Find your direction</span><button type="button" onClick={() => setOpen(false)} aria-label="Close search suggestions" className="grid size-9 place-items-center rounded-full transition-colors hover:bg-sand"><X size={17}/></button></div>
        <label htmlFor="nav-search-mobile" className="sr-only">Search products, guides, images and videos</label>
        <div className="flex min-h-11 items-center gap-2 border border-stone-300 bg-white px-3 nav:hidden"><Search size={17} className="shrink-0 text-gold-deep"/><input ref={mobileInputRef} id="nav-search-mobile" type="search" autoComplete="off" value={query} onChange={event => updateQuery(event.target.value)} onKeyDown={submitFirst} placeholder="Product, material or question…" className="min-w-0 flex-1 border-0 bg-transparent text-base outline-none"/></div>
        <p className="mb-0 mt-2 text-xs leading-5 text-muted">Products, original photos, videos, guides and answers.</p>
      </div>
      <div className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-3 pt-3 nav:px-4">
        {!query.trim() ? <><p className="mb-2 px-2 text-[.65rem] font-bold uppercase tracking-wider text-muted">Popular searches</p><div className="flex flex-wrap gap-2 px-1 pb-2">{popular.map(term => <button type="button" key={term} onClick={() => { setQuery(term); setLimit(8); mobileInputRef.current?.focus(); }} className="min-h-10 rounded-full border border-stone-300 px-3 text-xs font-semibold transition-colors hover:border-ink hover:bg-sand">{term}</button>)}</div></> : <>
          <div className="mb-3 flex items-center justify-between gap-2 px-2"><p className="mb-0 text-xs text-muted"><strong className="text-ink">{results.length}</strong> {results.length === 1 ? 'match' : 'matches'} for “{query.trim()}”</p>{query && <button type="button" onClick={() => { setQuery(''); setType('All'); }} className="min-h-9 shrink-0 text-xs underline underline-offset-4">Clear</button>}</div>
          <div role="group" aria-label="Filter search suggestions" className="nav-search-filters mb-3 flex gap-1.5 overflow-x-auto px-1 pb-2">{searchTypes.map(item => <button type="button" key={item} aria-pressed={type === item} onClick={() => { setType(item); setLimit(8); }} className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-semibold transition-colors ${type === item ? 'border-ink bg-ink text-white' : 'border-stone-300 hover:border-ink'}`}>{item === 'All' ? 'All' : `${item}s`}</button>)}</div>
          {shown.length ? <div ref={resultsRef} onKeyDown={moveWithinResults} className="space-y-1">{shown.map(item => <Link data-search-result key={`${item.type}:${item.href}:${item.title}`} to={item.href} onClick={choose} className="group flex min-h-16 items-center gap-3 px-2 py-2 transition-colors hover:bg-sand/70 focus:bg-sand/70"><span className="size-12 shrink-0 overflow-hidden bg-sand">{item.image ? <img src={item.image} alt="" width="48" height="48" className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center text-gold-deep"><Search size={18}/></span>}</span><span className="min-w-0 flex-1"><span className="block text-[.6rem] font-bold uppercase tracking-wider text-gold-deep">{item.type}</span><span className="block truncate text-sm font-semibold text-ink">{item.title}</span><span className="block truncate text-xs text-muted">{item.description}</span></span><ArrowUpRight size={15} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></Link>)}</div> : <p className="px-2 py-5 text-sm text-muted">No exact match. Try “strap”, “wallet”, or “fit”.</p>}
          {results.length > shown.length && <button type="button" onClick={() => setLimit(value => value + 8)} className="mt-2 min-h-11 w-full border border-stone-300 text-xs font-semibold transition-colors hover:border-ink hover:bg-sand">Show more matches</button>}
        </>}
      </div>
    </div>}
  </div>;
}
