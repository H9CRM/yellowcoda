import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { guideEnhancements } from '../../data/guideEnhancements';

export function guideReadingMinutes(guide) {
  const extra = guideEnhancements[guide.slug];
  const text = [guide.answer, extra.intro, ...guide.sections.map(item => item.body), ...extra.extraSections.map(item => item.body), ...extra.checklist, ...extra.table.rows.flat()].join(' ');
  return Math.max(3, Math.ceil(text.split(/\s+/).length / 200));
}

export default function GuideCard({ guide, compact = false }) {
  const extra = guideEnhancements[guide.slug];
  const href = `/guides/${guide.slug}`;
  return <article className="group flex min-w-0 flex-col overflow-hidden border border-stone-200 bg-paper shadow-[0_12px_30px_rgba(22,35,27,.07)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(22,35,27,.12)] motion-reduce:transform-none">
    <Link to={href} className="grid h-52 grid-cols-[1.6fr_.68fr] gap-1 overflow-hidden bg-sand sm:h-56" aria-label={`Read ${guide.title}`}>
      <img src={extra.cover.src} alt={extra.cover.alt} width="480" height="360" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none"/>
      <span className="grid min-h-0 grid-rows-2 gap-1"><img src={extra.images[0].src} alt={extra.images[0].alt} width="160" height="160" loading="lazy" decoding="async" className="h-full w-full object-cover"/><img src={extra.images[1].src} alt={extra.images[1].alt} width="160" height="160" loading="lazy" decoding="async" className="h-full w-full object-cover"/></span>
    </Link>
    <div className={`flex flex-1 flex-col ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[.66rem] font-bold uppercase tracking-[.14em]"><span className="text-gold-deep">{guide.eyebrow}</span><span className="inline-flex items-center gap-1 text-muted"><Clock3 size={13} aria-hidden="true"/>{guideReadingMinutes(guide)} min read</span></div>
      <h3 className={`mb-3 mt-4 font-serif leading-tight ${compact ? 'text-2xl' : 'text-3xl'}`}><Link to={href} className="hover:underline hover:underline-offset-4">{guide.title}</Link></h3>
      <p className="mb-6 line-clamp-3 text-sm leading-7 text-muted">{guide.description}</p>
      <Link to={href} className="mt-auto inline-flex min-h-11 w-max items-center gap-2 border-b border-ink text-xs font-semibold transition-[gap] hover:gap-3">Read the guide <ArrowUpRight size={16} aria-hidden="true"/></Link>
    </div>
  </article>;
}
