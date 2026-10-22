const base = 'button group inline-flex min-h-12 items-center justify-center gap-3 border px-5 py-3 text-xs font-bold tracking-wide whitespace-nowrap transition-[background-color,transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:transition-transform [&:hover_svg]:translate-x-0.5';

const variants = {
  dark: 'border-transparent bg-ink text-white hover:bg-ink-soft',
  gold: 'border-transparent bg-gold-light text-ink hover:bg-gold-pale',
  outline: 'border-stone-400 bg-transparent text-ink hover:border-ink hover:bg-stone-100',
  'ghost-light': 'border-stone-500 bg-transparent text-white hover:bg-ink-soft',
};

export function buttonClass(variant = 'dark', extra = '') {
  return `${base} ${variants[variant] ?? variants.dark} ${extra}`.trim();
}
