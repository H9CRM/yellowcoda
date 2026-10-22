import { motion, useReducedMotion } from 'framer-motion';

const highlights = [
  'Handmade watch straps',
  'Custom leather straps',
  'Rally and racing straps',
  'Integrated strap work',
  'Made for your watch',
  'Measured for your wrist',
  'Stitch and buckle details',
  'Leather wallets',
  'Card holders',
  'Vegetable tan belts',
  'Watch pouches',
  'Small leather goods',
];

function HighlightRow({ duplicate = false }) {
  return <div className={`flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0 ${duplicate ? 'motion-reduce:hidden' : ''}`} aria-hidden={duplicate ? 'true' : undefined}>
    {highlights.map(item => <span key={item} className="flex shrink-0 items-center gap-6 whitespace-nowrap sm:gap-10">
      <span className="text-[.68rem] font-semibold uppercase tracking-[.18em] sm:text-xs">{item}</span>
      <span aria-hidden="true" className="text-lg leading-none text-gold-light">✳</span>
    </span>)}
  </div>;
}

export default function CraftMarquee({ className = '' }) {
  const reducedMotion = useReducedMotion();
  return <div className={`overflow-hidden border-y border-ink/15 bg-[#e7e3d7] py-5 text-ink ${className}`} aria-label="YellowCada craft highlights">
    <motion.div
      className="flex w-max items-center motion-reduce:w-auto motion-reduce:justify-center motion-reduce:px-4"
      initial={{ x: '0%' }}
      animate={{ x: reducedMotion ? '0%' : '-50%' }}
      transition={reducedMotion ? { duration: 0 } : { duration: 46, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
    >
      <HighlightRow />
      <HighlightRow duplicate />
    </motion.div>
  </div>;
}
