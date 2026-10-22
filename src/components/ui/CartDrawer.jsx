import { ArrowUpRight, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { buttonClass } from '../common/buttonStyles';
import { useStore } from '../../hooks/useStore';
import { bagProductPath, findBagProduct } from '../../data/bag';
import { formatStrapDirection } from '../../data/strapDirections';
import OffCanvas from './OffCanvas';
import QuantityStepper from './QuantityStepper';

export default function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, remove, quantity } = useStore();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const previousCount = useRef(cart.length);
  useEffect(() => {
    if (drawerOpen && cart.length < previousCount.current) {
      const panel = document.getElementById('cart-drawer');
      (panel?.querySelector('button[aria-label^="Remove"]') || panel?.querySelector('a[href="/products"]'))?.focus();
    }
    previousCount.current = cart.length;
  }, [cart.length, drawerOpen]);
  const close = () => setDrawerOpen(false);
  return <OffCanvas id="cart-drawer" open={drawerOpen} onClose={close} title="Enquiry bag" eyebrow="Your selection" description={`${count} ${count === 1 ? 'item' : 'items'} selected for one enquiry.`}>
    {cart.length ? cart.map(item => { const product = findBagProduct(item.id); if (!product) return null; return <div className="drawer-item grid grid-cols-[64px_minmax(0,1fr)_44px] gap-2 border-b border-stone-200 py-4 sm:grid-cols-[77px_minmax(0,1fr)_44px] sm:gap-3" key={item.id}><div className="aspect-square bg-sand">{product.image ? <img src={product.image} alt={product.imageAlt || `${product.name} design direction`} width="88" height="88" loading="lazy" className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center px-2 text-center text-[.6rem] text-muted">Image on enquiry</span>}</div><div className="min-w-0"><Link to={bagProductPath(product)} onClick={close} className="text-sm font-semibold leading-tight hover:underline">{product.name}</Link><small className="block text-muted">Enquiry only</small>{item.direction && <small className="mt-1 block leading-5 text-muted">{formatStrapDirection(item.direction)}</small>}<span className="block text-xs">Price on request</span><div className="mt-2"><QuantityStepper productName={product.name} value={item.quantity} onChange={next => quantity(item.id, next)}/></div></div><button type="button" className="grid size-11 place-items-center self-start" aria-label={`Remove ${product.name}`} onClick={() => remove(item.id)}><Trash2 size={17}/></button></div>; }) : <div className="drawer-empty px-3 py-12 text-center"><h3>Nothing in your bag yet.</h3><p>Keep the products you like here, then send one considered enquiry.</p><Link to="/products" onClick={close}>Explore products <ArrowUpRight size={16}/></Link></div>}
    {cart.length > 0 && <div className="sticky bottom-0 -mx-5 mt-8 border-t border-stone-200 bg-paper px-5 pb-2 pt-5 sm:-mx-7 sm:px-7"><p className="text-xs leading-relaxed text-muted">No payment is collected. YellowCada confirms details and price before any order.</p><Link to="/checkout" className={`${buttonClass('dark')} w-full justify-center`} onClick={close}>Continue to enquiry <ArrowUpRight size={17}/></Link><Link to="/cart" className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-ink px-4 text-xs font-semibold" onClick={close}>Review and edit bag</Link></div>}
  </OffCanvas>;
}
