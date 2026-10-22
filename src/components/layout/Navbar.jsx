import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Heart, Menu, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '../../data/navigation';
import { catalogProducts } from '../../data/catalogue';
import { useStore } from '../../hooks/useStore';
import OffCanvas from '../ui/OffCanvas';
import NavSearch from './NavSearch';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const { cart, saved, toggleSaved, add, addMany, drawerOpen, setDrawerOpen } = useStore();
  const favorites = saved.map(id => catalogProducts.find(product => product.id === id)).filter(Boolean);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const previousFavoriteCount = useRef(favorites.length);

  useEffect(() => {
    const sentinel = document.querySelector('[data-nav-sentinel]');
    if (!sentinel || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setMobileOpen(false); setFavoritesOpen(false); setSearchOpen(false); }, [pathname, hash]);
  useEffect(() => {
    if (favoritesOpen && favorites.length < previousFavoriteCount.current) {
      const panel = document.getElementById('favorites-panel');
      (panel?.querySelector('button[aria-label^="Remove"]') || panel?.querySelector('a[href="/products"]'))?.focus();
    }
    previousFavoriteCount.current = favorites.length;
  }, [favorites.length, favoritesOpen]);

  const closePanels = () => { setMobileOpen(false); setFavoritesOpen(false); setSearchOpen(false); };
  const navigate = () => { closePanels(); requestAnimationFrame(() => window.scrollTo({ top:0, behavior:'smooth' })); };
  const addFavorite = id => { setFavoritesOpen(false); add(id); };
  const addAllFavorites = () => { setFavoritesOpen(false); addMany(favorites.map(product => product.id)); };

  return <>
    <header className={`sticky top-0 z-40 border-b border-stone-200 bg-paper/95 backdrop-blur-xl transition-[box-shadow,background-color] duration-300 ${scrolled ? 'shadow-[0_12px_32px_rgba(23,32,27,.09)]' : ''}`}>
      <div className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-1 px-3 transition-[height] duration-300 sm:gap-3 sm:px-7 md:px-10 ${scrolled ? 'h-[58px]' : 'h-[68px]'}`}>
        <Link className="flex shrink-0 items-center gap-2.5 whitespace-nowrap" to="/" onClick={navigate} aria-label="YellowCada home"><img src="/images/yellowcada-official-logo.jpg" className={`rounded-full border border-white object-cover transition-[width,height] duration-300 ${scrolled ? 'size-9' : 'size-11'}`} alt="" width="44" height="44"/><span className="hidden font-sans text-xl font-extrabold tracking-tight text-ink sm:block nav:hidden xl:block">YellowCada<span className="text-gold-deep">.</span></span></Link>
        <nav className="hidden items-center nav:flex nav:gap-4 xl:gap-5" aria-label="Main navigation">{navigation.map(item => <NavLink key={item.href} to={item.href} onClick={navigate} className={({isActive}) => `relative py-4 text-[.78rem] font-semibold whitespace-nowrap transition-colors hover:text-ink after:absolute after:bottom-2.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold-deep after:transition-transform xl:text-sm ${isActive ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0 hover:after:scale-x-100'}`}>{item.label}</NavLink>)}</nav>
        <div className="flex shrink-0 items-center gap-0.5">
          <NavSearch open={searchOpen} setOpen={setSearchOpen} onOpen={() => { setMobileOpen(false); setFavoritesOpen(false); setDrawerOpen(false); }} scrolled={scrolled}/>
          <button type="button" aria-label={`Open favourites, ${saved.length} saved ${saved.length === 1 ? 'product' : 'products'}`} aria-haspopup="dialog" aria-expanded={favoritesOpen} aria-controls="favorites-panel" onClick={() => { setMobileOpen(false); setSearchOpen(false); setFavoritesOpen(true); }} className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/70"><Heart size={20} strokeWidth={1.8}/>{saved.length > 0 && <span className="absolute right-0.5 top-0 grid size-4 place-items-center rounded-full bg-gold-light text-[.6rem]">{saved.length}</span>}</button>
          <button type="button" aria-label={`Open enquiry bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`} aria-haspopup="dialog" aria-expanded={drawerOpen} aria-controls="cart-drawer" onClick={() => { closePanels(); setDrawerOpen(true); }} className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/70"><ShoppingBag size={20} strokeWidth={1.8}/>{cartCount > 0 && <span className="absolute right-0.5 top-0 grid size-4 place-items-center rounded-full bg-gold-light text-[.6rem]">{cartCount}</span>}</button>
          <button type="button" className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/70 nav:hidden" aria-label="Open menu" aria-controls="mobile-navigation-panel" aria-haspopup="dialog" aria-expanded={mobileOpen} onClick={() => { setFavoritesOpen(false); setSearchOpen(false); setMobileOpen(true); }}><Menu size={24}/></button>
        </div>
      </div>
    </header>
    <OffCanvas id="mobile-navigation-panel" open={mobileOpen} onClose={() => setMobileOpen(false)} title="Explore YellowCada" eyebrow="Menu" side="left"><nav aria-label="Mobile navigation" className="divide-y divide-stone-200">{navigation.map((item,index) => <NavLink key={item.href} to={item.href} onClick={navigate} className={({isActive}) => `flex min-h-16 items-center justify-between gap-4 py-3 font-serif text-2xl transition-colors ${isActive ? 'text-gold-deep' : 'text-ink hover:text-gold-deep'}`}><span><small className="mr-3 align-middle font-sans text-[.65rem] text-muted">{String(index+1).padStart(2,'0')}</small>{item.label}</span><ArrowUpRight size={18} className="shrink-0"/></NavLink>)}</nav><div className="mt-8 border-t border-stone-200 pt-6"><p className="mb-4 text-xs leading-relaxed text-muted">Handmade watch straps and considered leather goods. Explore the archive, then share your requirements.</p><Link to="/contact" onClick={navigate} className="inline-flex min-h-12 w-full items-center justify-between bg-ink px-5 text-xs font-semibold text-white">Discuss your idea <ArrowUpRight size={16}/></Link></div></OffCanvas>
    <OffCanvas id="favorites-panel" open={favoritesOpen} onClose={() => setFavoritesOpen(false)} title="Favourites" eyebrow="Your edit" description={`${favorites.length} saved ${favorites.length === 1 ? 'product' : 'products'}`}>
      {favorites.length ? <><div className="space-y-4">{favorites.map(product => <article key={product.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-3 border-b border-stone-200 pb-4"><div className="aspect-square overflow-hidden bg-sand">{product.image ? <img src={product.image} alt={product.imageAlt || product.name} width="80" height="80" loading="lazy" className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center p-2 text-center text-[.58rem] text-muted">Details on enquiry</span>}</div><div className="min-w-0"><p className="mb-1 text-[.62rem] font-bold uppercase tracking-wider text-muted">{product.category}</p><h3 className="mb-2 font-serif text-lg leading-tight"><Link to={`/products/${product.slug}`} onClick={closePanels} className="hover:underline">{product.name}</Link></h3><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><button type="button" onClick={() => addFavorite(product.id)} className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold underline underline-offset-4"><ShoppingBag size={14}/> Add to bag</button><button type="button" onClick={() => toggleSaved(product.id)} aria-label={`Remove ${product.name} from favourites`} className="inline-flex min-h-9 items-center gap-1 text-xs text-muted underline underline-offset-4"><Trash2 size={13}/> Remove</button></div></div></article>)}</div><div className="sticky bottom-0 -mx-5 mt-5 border-t border-stone-200 bg-paper px-5 py-5 sm:-mx-7 sm:px-7"><p className="mb-3 text-xs leading-relaxed text-muted">Add every saved piece to one enquiry bag. Price and availability are confirmed directly.</p><button type="button" onClick={addAllFavorites} className="inline-flex min-h-12 w-full items-center justify-between bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-gold-deep">Add all {favorites.length} to bag <ShoppingBag size={17}/></button></div></> : <div className="py-12 text-center"><Heart size={28} className="mx-auto mb-5 text-gold-deep"/><h3 className="font-serif text-2xl">Nothing saved yet.</h3><p className="text-sm leading-relaxed text-muted">Save items from their product detail pages to collect them here.</p></div>}
      <Link to="/products" onClick={closePanels} className="mt-4 inline-flex min-h-11 w-full items-center justify-between border border-ink px-5 text-xs font-semibold">Explore products <ArrowUpRight size={16}/></Link>
    </OffCanvas>
  </>;
}
