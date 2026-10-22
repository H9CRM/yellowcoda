import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { catalogProducts } from '../data/catalogue';
import { findBagProduct } from '../data/bag';
import { normalizeStrapDirection } from '../data/strapDirections';

const StoreContext = createContext(null);
const key = 'yellowcada-vite-store';

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [compare, setCompare] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      const old = JSON.parse(localStorage.getItem(key) || '{}');
      if (Array.isArray(old.cart)) setCart(old.cart.filter(item => item && findBagProduct(item.id) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 10).slice(0, 25).map(item => ({ id:item.id, quantity:item.quantity, ...(item.id === 'catalog-1' && normalizeStrapDirection(item.direction) ? { direction:normalizeStrapDirection(item.direction) } : {}) })));
      const validIds = new Set(catalogProducts.map(product => product.id));
      if (Array.isArray(old.saved)) setSaved(old.saved.filter(id => validIds.has(id)));
      if (Array.isArray(old.compare)) setCompare(old.compare.filter(id => validIds.has(id)).slice(0, 4));
    } catch { /* Storage can be unavailable; shopping still works for this session. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => { if (!storageReady) return; try { localStorage.setItem(key, JSON.stringify({ cart, saved, compare })); } catch { /* private browsing */ } }, [cart, saved, compare, storageReady]);
  const value = useMemo(() => ({
    cart, saved, compare, compareOpen, setCompareOpen, drawerOpen, setDrawerOpen,
    add: id => { if (!findBagProduct(id)) return; setCart(items => { const found = items.find(item => item.id === id); return found ? items.map(item => item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item) : items.length < 25 ? [...items, { id, quantity: 1 }] : items; }); setDrawerOpen(true); },
    addConfigured: (id, direction) => { const valid = normalizeStrapDirection(direction); if (id !== 'catalog-1' || !valid) return; setCart(items => { const found = items.find(item => item.id === id); return found ? items.map(item => item.id === id ? { ...item, direction:valid } : item) : items.length < 25 ? [...items, { id, quantity:1, direction:valid }] : items; }); setDrawerOpen(true); },
    addMany: ids => { const valid = [...new Set(ids)].filter(id => findBagProduct(id)); if (!valid.length) return; setCart(items => { const next = [...items]; for (const id of valid) { if (!next.some(item => item.id === id) && next.length < 25) next.push({ id, quantity: 1 }); } return next; }); setDrawerOpen(true); },
    remove: id => setCart(items => items.filter(item => item.id !== id)),
    quantity: (id, quantity) => setCart(items => items.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item)),
    clear: () => setCart([]),
    toggleSaved: id => setSaved(items => items.includes(id) ? items.filter(value => value !== id) : [...items, id]),
    toggleCompare: id => setCompare(items => items.includes(id) ? items.filter(value => value !== id) : items.length < 4 ? [...items, id] : items),
    clearCompare: () => setCompare([])
  }), [cart, saved, compare, compareOpen, drawerOpen]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('StoreProvider is missing');
  return value;
}
