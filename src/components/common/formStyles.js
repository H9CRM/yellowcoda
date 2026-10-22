export const formSurface = [
  'bg-white p-6 shadow-soft md:p-12',
  '[&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-3xl',
  '[&_label]:my-5 [&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-xs [&_label]:font-semibold',
  '[&_button[type=submit]]:mt-3',
].join(' ');

export const formField = 'min-h-12 w-full border border-stone-300 bg-paper px-4 py-3 text-base outline-none transition-[border-color,box-shadow] duration-200 focus:border-olive focus:ring-2 focus:ring-olive/20';
