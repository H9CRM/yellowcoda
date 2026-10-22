import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import { images } from '../../data/images';

export default function HeroSection() {
  const reducedMotion = useReducedMotion();

  return <section className="relative isolate overflow-clip bg-ink text-paper" aria-labelledby="home-hero-title">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(124,106,69,.19),transparent_42%),linear-gradient(145deg,#17201b_8%,#111914_100%)]"/>
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[57%] hidden w-px bg-white/5 lg:block"/>
    <div className="site-container relative z-10 mx-auto grid w-full max-w-7xl items-center gap-9 px-4 pb-14 pt-14 sm:px-7 md:grid-cols-[.95fr_1.05fr] md:gap-8 md:px-10 md:py-20 lg:min-h-[740px] lg:gap-12">
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-3 text-[.68rem] font-semibold uppercase tracking-[.22em] text-gold-light"><span className="h-px w-8 bg-gold-light"/> YellowCada / watch straps</span>
        <h1 id="home-hero-title" className="mb-6 mt-7 max-w-[10ch] font-serif text-[clamp(3.5rem,6.7vw,7.1rem)] leading-[.97] tracking-[-.06em]">The strap is <em className="font-normal text-gold-light">the story.</em></h1>
        <p className="max-w-xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">Handmade leather watch straps shaped around proportion, material and the details you choose. Begin with a direction, then discuss the exact fit with YellowCada.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button to="/products/watch-straps" variant="gold">Explore watch straps <ArrowUpRight size={18}/></Button>
          <Button to="/#customize-straps" variant="ghost-light">Shape a direction <ArrowDownRight size={18}/></Button>
        </div>
        <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-6 sm:mt-16">
          <div><strong className="block text-xs font-semibold text-paper">01 / Material</strong><span className="mt-1.5 block text-[.68rem] leading-5 text-stone-400">Choose a visual direction</span></div>
          <div className="border-l border-white/15 pl-3"><strong className="block text-xs font-semibold text-paper">02 / Detail</strong><span className="mt-1.5 block text-[.68rem] leading-5 text-stone-400">Consider stitch and finish</span></div>
          <div className="border-l border-white/15 pl-3"><strong className="block text-xs font-semibold text-paper">03 / Fit</strong><span className="mt-1.5 block text-[.68rem] leading-5 text-stone-400">Confirm it with the maker</span></div>
        </div>
      </div>

      <Link to="/products/watch-straps" className="group relative block min-w-0 focus-visible:rounded-sm" aria-label="Explore YellowCada handmade watch straps">
        <motion.div initial={false} whileHover={reducedMotion ? undefined : { y: -4, rotate: -0.8 }} transition={{ type:'spring', stiffness:180, damping:24 }} className="relative isolate grid aspect-square place-items-center overflow-hidden border border-white/10 bg-[#222720] shadow-[0_34px_90px_rgba(0,0,0,.42)] sm:aspect-[1.08] md:aspect-[.8] lg:aspect-[1.08]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_43%,rgba(185,145,92,.26),transparent_58%),linear-gradient(140deg,#34332a_0%,#1c241e_45%,#111813_100%)]"/>
          <div aria-hidden="true" className="absolute inset-5 border border-white/8 sm:inset-7"/>
          <div aria-hidden="true" className="absolute -bottom-[24%] left-[10%] aspect-square w-[80%] rounded-full bg-black/45 blur-3xl"/>
          <span className="absolute left-5 top-5 z-20 text-[.56rem] font-semibold uppercase tracking-[.2em] text-paper/75 sm:left-8 sm:top-8">The art of the strap</span>
          <motion.div initial={false} animate={reducedMotion ? { y:0 } : { y:[0,-9,0] }} transition={reducedMotion ? undefined : { duration:8, repeat:Infinity, ease:'easeInOut' }} className="relative z-10 w-[80%] max-w-[680px] drop-shadow-[0_32px_28px_rgba(0,0,0,.48)] min-[420px]:w-[84%] sm:w-[88%]">
            <OptimizedImage {...images.hero} priority className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"/>
          </motion.div>
          <div className="absolute inset-x-5 bottom-5 z-20 hidden items-end justify-between gap-3 border-t border-white/15 pt-3 text-[.6rem] uppercase tracking-[.16em] text-paper/75 sm:inset-x-8 sm:bottom-8 sm:flex"><span>Two pieces. One point of view.</span><span className="whitespace-nowrap text-gold-light">Illustrative direction ↗</span></div>
        </motion.div>
      </Link>
    </div>
    <div className="relative z-10 mx-auto hidden max-w-7xl justify-between gap-5 px-4 pb-5 text-[.6rem] uppercase tracking-[.16em] text-stone-400 sm:flex sm:px-7 md:px-10"><span>Made around the details.</span><span>Scroll to explore ↓</span></div>
  </section>;
}
