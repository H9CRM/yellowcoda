import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { guides } from '../../data/guides';
import { guideEnhancements } from '../../data/guideEnhancements';

export default function EditorialSection() {
  const trackRef = useRef(null);
  const [position,setPosition] = useState({index:0,canPrev:false,canNext:true});
  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : 1;
    setPosition({index:Math.min(guides.length-1,Math.round(track.scrollLeft/step)),canPrev:track.scrollLeft>2,canNext:track.scrollLeft+track.clientWidth<track.scrollWidth-2});
  }, []);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    updatePosition();
    return () => observer.disconnect();
  }, [updatePosition]);
  const scroll = direction => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = (first?.getBoundingClientRect().width || track.clientWidth) + gap;
    track.scrollBy({left:direction*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return <section className="bg-[#e9ece4] py-16 md:py-24" aria-labelledby="articles-title"><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10"><div className="max-w-3xl"><span className="text-xs font-bold uppercase tracking-[.18em] text-gold-deep">Explore further</span><h2 id="articles-title" className="mb-3 mt-3 font-serif text-4xl leading-[1.08] sm:text-5xl">Read the details that matter.</h2><p className="mb-0 max-w-2xl text-sm leading-relaxed text-muted">Six practical guides to fit, proportion, care and describing the strap you want.</p></div><div className="flex items-center gap-2"><span className="mr-3 text-xs text-muted" aria-live="polite">Guide {position.index+1} of {guides.length}</span><button type="button" onClick={() => scroll(-1)} disabled={!position.canPrev} aria-label="Previous articles" aria-controls="article-carousel" className="grid size-11 place-items-center rounded-full border border-stone-400 transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-40"><ArrowLeft size={19}/></button><button type="button" onClick={() => scroll(1)} disabled={!position.canNext} aria-label="Next articles" aria-controls="article-carousel" className="grid size-11 place-items-center rounded-full border border-stone-400 transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-40"><ArrowRight size={19}/></button></div></div>
    <p id="article-carousel-instructions" className="sr-only">Swipe or use the previous and next buttons to browse articles.</p><div id="article-carousel" ref={trackRef} role="region" aria-roledescription="carousel" aria-label="Watch strap articles" aria-describedby="article-carousel-instructions" onScroll={updatePosition} className="article-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-3">{guides.map((guide,index) => <article key={guide.slug} className="min-w-0 shrink-0 basis-[84%] snap-start overflow-hidden bg-paper shadow-sm sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"><Link to={`/guides/${guide.slug}`} className="group block overflow-hidden bg-sand" aria-label={`Read ${guide.title}`}><img src={guideEnhancements[guide.slug].cover.src} alt={guideEnhancements[guide.slug].cover.alt} width="640" height="490" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"/></Link><div className="flex min-h-[230px] flex-col p-5 sm:p-6"><p className="mb-3 text-[.62rem] font-bold uppercase tracking-[.15em] text-gold-deep">{guide.eyebrow} <span className="mx-1 text-stone-400">/</span> {String(index+1).padStart(2,'0')}</p><h3 className="mb-3 font-serif text-2xl leading-tight"><Link to={`/guides/${guide.slug}`} className="hover:underline">{guide.title}</Link></h3><p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted">{guide.description}</p><Link to={`/guides/${guide.slug}`} className="mt-auto inline-flex min-h-11 w-max items-center gap-2 text-xs font-semibold underline underline-offset-4">Read article <ArrowUpRight size={15}/></Link></div></article>)}</div>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-stone-300 pt-6"><p className="mb-0 text-xs text-muted">Practical reading before a custom enquiry.</p><Link to="/guides" className="inline-flex min-h-12 items-center gap-2 border border-ink px-5 text-xs font-semibold transition-colors hover:bg-ink hover:text-white">View all articles <ArrowUpRight size={16}/></Link></div>
  </div></section>;
}
