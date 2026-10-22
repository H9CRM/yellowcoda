import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const columns = [
  [
    { src: '/videos/Cl6QJDWAioJ.jpg', alt: 'Rally leather watch strap shown in the YellowCada public archive', label: '01 / Strap work' },
    { src: '/images/instagram/yellowcada-crocodile-bifold-wallet.jpg', alt: 'Handmade textured bifold wallet from a YellowCada Instagram post', label: '02 / Small leather goods' },
  ],
  [
    { src: '/images/instagram/yellowcada-vegetable-tan-leather-belt-buckle.webp', alt: 'Vegetable tan leather belt buckle detail from the YellowCada Instagram archive', label: '03 / Material details' },
    { src: '/images/facebook/yellowcada-black-textured-watch-strap-pair.jpg', alt: 'Black textured watch strap pair from YellowCada Facebook imagery', label: '04 / Finishing' },
  ],
];

export default function StoryParallaxGallery() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const left = useSpring(useTransform(scrollYProgress, [0, 1], [-56, 56]), { stiffness: 90, damping: 25 });
  const right = useSpring(useTransform(scrollYProgress, [0, 1], [56, -56]), { stiffness: 90, damping: 25 });

  return <div ref={ref} className="relative isolate h-[430px] overflow-hidden sm:h-[580px] lg:h-[700px]" aria-label="YellowCada leathercraft archive in photographs">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#e9ece4] via-transparent to-[#e9ece4] opacity-40" />
    <div className="grid grid-cols-2 gap-3 sm:gap-5">
      {columns.map((images, index) => <motion.div
        key={index}
        className={`grid content-start gap-3 sm:gap-5 ${index === 1 ? 'pt-12 sm:pt-20' : 'pt-3'}`}
        style={reducedMotion ? undefined : { y: index === 0 ? left : right }}
      >
        {images.map(image => <figure key={image.src} className="relative m-0 overflow-hidden bg-sand shadow-[0_18px_35px_rgba(23,32,27,.13)]">
          <img src={image.src} alt={image.alt} width="540" height="680" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pb-3 pt-9 text-[.6rem] font-semibold uppercase tracking-[.12em] text-white sm:px-4 sm:pb-4">{image.label}</figcaption>
        </figure>)}
      </motion.div>)}
    </div>
  </div>;
}
