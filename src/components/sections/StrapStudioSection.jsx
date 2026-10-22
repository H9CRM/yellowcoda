import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import StrapPreview from './StrapPreview';
import { formatStrapDirection, strapHardware, strapLeathers, strapStitches } from '../../data/strapDirections';
import { useStore } from '../../hooks/useStore';

const initialDirection = { leather:'cognac', stitch:'tonal', hardware:'steel' };

export default function StrapStudioSection() {
  const [direction, setDirection] = useState(initialDirection);
  const { addConfigured } = useStore();
  const reducedMotion = useReducedMotion();
  const setChoice = (key, value) => setDirection(current => ({ ...current, [key]:value }));

  return <section id="customize-straps" aria-labelledby="strap-studio-title" className="scroll-mt-20 bg-[#eae8df] py-16 text-ink sm:py-20 lg:py-28">
    <div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6 md:mb-12"><div><span className="text-[.67rem] font-bold uppercase tracking-[.2em] text-gold-deep">The strap studio</span><h2 id="strap-studio-title" className="mb-3 mt-3 max-w-[14ch] text-[clamp(2.7rem,5vw,5.3rem)] leading-[1.02]">Make the details yours.</h2><p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">Explore a leather colour, stitching and buckle finish together. Save the direction you like, then YellowCada can confirm what is possible for your watch.</p></div><Link to="/products/watch-straps" className="inline-flex min-h-11 items-center gap-2 border-b border-ink pb-1 text-xs font-semibold transition-[gap] hover:gap-3">View the strap collection <ArrowUpRight size={16}/></Link></div>
      <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,.94fr)] lg:gap-8">
        <div className="relative isolate flex min-h-[390px] items-center justify-center overflow-hidden bg-[#d9d2c4] p-5 shadow-[0_24px_65px_rgba(40,38,28,.13)] sm:min-h-[540px] sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.68),transparent_55%),linear-gradient(135deg,#e9e2d4,#cfc8b9)]"/>
          <div aria-hidden="true" className="absolute inset-5 border border-ink/8 sm:inset-8"/>
          <span className="absolute left-6 top-6 z-10 text-[.6rem] font-bold uppercase tracking-[.2em] text-ink/65 sm:left-10 sm:top-10">Live concept preview / 01</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${direction.leather}-${direction.stitch}-${direction.hardware}`} initial={reducedMotion ? false : { opacity:.55, scale:.975, y:8 }} animate={{ opacity:1, scale:1, y:0 }} exit={reducedMotion ? undefined : { opacity:0, scale:1.018, y:-6 }} transition={{ duration:reducedMotion ? 0 : .28, ease:'easeOut' }} className="relative z-10 flex w-full justify-center drop-shadow-[0_24px_20px_rgba(31,26,21,.2)]"><StrapPreview direction={direction}/></motion.div>
          </AnimatePresence>
          <span className="absolute bottom-6 left-6 right-6 z-10 border-t border-ink/15 pt-3 text-[.62rem] leading-5 text-ink/65 sm:bottom-9 sm:left-10 sm:right-10">Illustrative preview · colour and construction are confirmed on enquiry.</span>
        </div>

        <div className="flex min-w-0 flex-col bg-paper p-6 shadow-[0_16px_48px_rgba(40,38,28,.07)] sm:p-9 lg:p-10">
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-5"><div><p className="mb-1 text-[.65rem] font-bold uppercase tracking-[.18em] text-gold-deep">Your direction</p><h3 className="mb-0 font-serif text-3xl sm:text-4xl">Build a starting point.</h3></div><button type="button" onClick={() => setDirection(initialDirection)} aria-label="Reset strap direction" className="grid size-11 shrink-0 place-items-center rounded-full border border-stone-300 transition-colors hover:border-ink hover:bg-sand"><RotateCcw size={18}/></button></div>
          <fieldset className="mt-6"><legend className="mb-3 text-xs font-bold uppercase tracking-[.13em]">01 / Leather colour direction</legend><div className="grid grid-cols-3 gap-2">{strapLeathers.map(item => <motion.button key={item.id} type="button" whileTap={reducedMotion ? undefined : { scale:.96 }} aria-pressed={direction.leather === item.id} onClick={() => setChoice('leather',item.id)} className={`flex min-h-16 flex-col items-center justify-center gap-2 border px-2 py-2 text-xs font-semibold transition-colors ${direction.leather === item.id ? 'border-ink bg-[#f0ede4]' : 'border-stone-300 hover:border-ink'}`}><span className="size-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor:item.base }}/>{item.name}</motion.button>)}</div></fieldset>
          <fieldset className="mt-6"><legend className="mb-3 text-xs font-bold uppercase tracking-[.13em]">02 / Stitch character</legend><div className="grid grid-cols-2 gap-2">{strapStitches.map(item => <motion.button key={item.id} type="button" whileTap={reducedMotion ? undefined : { scale:.97 }} aria-pressed={direction.stitch === item.id} onClick={() => setChoice('stitch',item.id)} className={`min-h-12 border px-3 text-xs font-semibold transition-colors ${direction.stitch === item.id ? 'border-ink bg-[#f0ede4]' : 'border-stone-300 hover:border-ink'}`}>{item.name}</motion.button>)}</div></fieldset>
          <fieldset className="mt-6"><legend className="mb-3 text-xs font-bold uppercase tracking-[.13em]">03 / Buckle finish</legend><div className="grid grid-cols-2 gap-2">{strapHardware.map(item => <motion.button key={item.id} type="button" whileTap={reducedMotion ? undefined : { scale:.97 }} aria-pressed={direction.hardware === item.id} onClick={() => setChoice('hardware',item.id)} className={`min-h-12 border px-3 text-xs font-semibold transition-colors ${direction.hardware === item.id ? 'border-ink bg-[#f0ede4]' : 'border-stone-300 hover:border-ink'}`}>{item.name}</motion.button>)}</div></fieldset>
          <div className="mt-auto pt-7"><p className="border-t border-stone-200 pt-5 text-xs leading-6 text-muted" aria-live="polite">{formatStrapDirection(direction)}. This is a visual starting point; actual material, hardware, fit, availability and price need confirmation.</p><button type="button" onClick={() => addConfigured('catalog-1', direction)} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-bold text-paper transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-md active:translate-y-0 motion-reduce:transform-none"><ShoppingBag size={17}/> Save direction to enquiry bag</button><p className="mt-3 mb-0 text-center text-[.7rem] text-muted">No payment is taken. The maker confirms every detail.</p></div>
        </div>
      </div>
    </div>
  </section>;
}
