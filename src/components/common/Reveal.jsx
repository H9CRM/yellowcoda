import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const hiddenStates = {
  up: { opacity: 0, y: 28 },
  left: { opacity: 0, x: 28 },
  right: { opacity: 0, x: -28 },
  scale: { opacity: 0, scale: .965 },
  fade: { opacity: 0 },
};

/** Keep prerendered content visible; animate only when an offscreen element enters view. */
export default function Reveal({ as: Component = 'div', children, className = '', variant = 'up', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window) || reducedMotion) return;
    if (element.getBoundingClientRect().top < window.innerHeight * .9) return;

    setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const MotionComponent = motion[Component] || motion.div;
  return <MotionComponent
    ref={ref}
    className={className}
    initial={false}
    animate={visible || reducedMotion ? { opacity: 1, x: 0, y: 0, scale: 1 } : hiddenStates[variant] || hiddenStates.up}
    whileHover={Component === 'article' && className.includes('feature-card') && !reducedMotion ? { y: -4 } : undefined}
    transition={{ duration: reducedMotion ? 0 : .68, delay: visible ? Math.min(delay, 3) * .085 : 0, ease: [.22, 1, .36, 1] }}
  >{children}</MotionComponent>;
}
