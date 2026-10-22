import { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Image as ImageIcon, Play, SlidersHorizontal } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import FAQ from '../components/common/FAQ';
import ImageLightbox from '../components/ui/ImageLightbox';
import MediaLightbox from '../components/ui/MediaLightbox';
import OffCanvas from '../components/ui/OffCanvas';
import { catalogProducts } from '../data/catalogue';
import { galleryCategories, galleryImageItems, galleryVideoItems } from '../data/galleryCollection';
import { galleryFaqs } from '../data/contextualFaqs';
import { webpageSchema, breadcrumbSchema, faqSchema } from '../utils/schemaHelpers';

const description = 'Browse YellowCada’s official Instagram, Facebook and YouTube archive by category. View original product photos, Reel stills, YouTube videos and clearly marked campaign concepts.';
const PAGE_SIZE = 24;
const productBySlug = new Map(catalogProducts.map(item => [item.slug,item]));

function FilterSheet({ open, categories, selected, onSelect, onClose }) {
  return <OffCanvas id="gallery-filter-panel" open={open} onClose={onClose} title="Filter gallery" side="bottom"><div className="grid gap-2">{['All',...categories].map(category => <button key={category} type="button" aria-pressed={selected === category} onClick={() => { onSelect(category); onClose(); }} className={`min-h-12 border px-4 text-left text-sm ${selected === category ? 'border-ink bg-ink text-white' : 'border-stone-300'}`}>{category}</button>)}</div></OffCanvas>;
}

function MediaCard({ item, onOpen }) {
  const video = item.type !== 'image';
  return <article className="group flex h-full min-w-0 flex-col overflow-hidden bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none">
    <button type="button" onClick={() => onOpen(item)} aria-label={`${video ? 'Play video' : 'Open image'}: ${item.title}`} className="relative block aspect-[4/5] w-full shrink-0 overflow-hidden bg-sand text-left">
      <img src={item.thumbnail} alt={item.alt} width="480" height="600" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none ${video ? 'bg-ink object-contain' : 'object-cover'}`}/>
      <span className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full bg-paper/95 text-ink shadow-sm">{video ? <Play size={18} fill="currentColor"/> : <ImageIcon size={18}/>}</span>
      <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1.5 text-[.58rem] font-bold uppercase tracking-[.12em] text-ink">{item.kind}</span>
    </button>
    <div className="flex min-h-[208px] flex-1 flex-col p-3 sm:min-h-[188px] sm:p-4"><p className="mb-2 text-[.62rem] font-semibold uppercase tracking-[.12em] text-muted">{item.category}</p><h3 className="m-0 line-clamp-2 min-h-[2.5rem] font-serif text-lg leading-tight sm:text-xl">{item.title}</h3><p className="mb-0 mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{item.productName ? `Related: ${item.productName}` : item.caption}</p><div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4 text-[.68rem] font-semibold sm:text-xs">{item.productSlug && <Link to={`/products/${item.productSlug}`} className="underline underline-offset-4">View product</Link>}{item.detailPath && <Link to={item.detailPath} className="underline underline-offset-4">View details <ArrowUpRight size={12} className="inline"/></Link>}</div></div>
  </article>;
}

export default function Gallery() {
  const [params,setParams] = useSearchParams();
  const type = params.get('type') === 'videos' ? 'videos' : 'images';
  const category = params.get('category') || 'All';
  const [limit,setLimit] = useState(PAGE_SIZE);
  const [sheetOpen,setSheetOpen] = useState(false);
  const [imageIndex,setImageIndex] = useState(-1);
  const [playing,setPlaying] = useState(null);
  const allItems = type === 'videos' ? galleryVideoItems : galleryImageItems;
  const categories = galleryCategories(allItems);
  const activeCategory = category === 'All' || categories.includes(category) ? category : 'All';
  const filtered = useMemo(() => allItems.filter(item => activeCategory === 'All' || item.category === activeCategory), [allItems,activeCategory]);
  const shown = filtered.slice(0,limit);
  const update = useCallback((next,replace=false) => { setLimit(PAGE_SIZE); setParams(current => { const value=new URLSearchParams(current); Object.entries(next).forEach(([key,val]) => { if (val) value.set(key,val); else value.delete(key); }); return value; },{replace}); },[setParams]);
  const changeType = nextType => { update({type:nextType,category:galleryCategories(nextType === 'videos' ? galleryVideoItems : galleryImageItems).includes(category) ? category : null}); setImageIndex(-1); setPlaying(null); };
  const changeCategory = nextCategory => update({category:nextCategory === 'All' ? null : nextCategory});
  const openItem = item => { if (item.type === 'image') setImageIndex(filtered.findIndex(entry => entry.id === item.id)); else setPlaying(item.original); };
  return <><SEO title="YellowCada Image & Video Gallery" path="/gallery" description={description} schema={[webpageSchema('/gallery','YellowCada image and video gallery',description),breadcrumbSchema([{name:'Home',path:'/'},{name:'Gallery',path:'/gallery'}]),faqSchema(galleryFaqs)]}/>
    <div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Gallery'}]}/></div>
    <section className="site-container mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-7 md:px-10 md:pb-14 md:pt-24"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] text-gold-deep">The visual archive</span><h1 className="mt-4 max-w-4xl text-5xl leading-[1.04] sm:text-6xl lg:text-7xl">Gallery, frame by frame.</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> Explore {galleryImageItems.length} images and concepts or {galleryVideoItems.length} Reels and videos from YellowCada’s documented archive. Use the navbar search to find a specific product or piece of media. Past work is a reference for a new enquiry; current options are confirmed directly.</p>
    </section>
    <section className="site-container mx-auto w-full max-w-7xl px-4 pb-20 sm:px-7 md:px-10 md:pb-28" aria-label="Media library">
      <div className="flex items-end justify-between gap-4 border-b border-stone-300"><div role="tablist" aria-label="Gallery media type" className="flex gap-7">{[['images','Images',galleryImageItems.length],['videos','Videos',galleryVideoItems.length]].map(([value,label,count]) => <button key={value} id={`gallery-tab-${value}`} type="button" role="tab" aria-selected={type===value} aria-controls="gallery-panel" tabIndex={type===value?0:-1} onClick={() => changeType(value)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next=value==='images'?'videos':'images'; changeType(next); document.getElementById(`gallery-tab-${next}`)?.focus(); } }} className={`min-h-14 border-b-2 px-1 text-sm font-semibold transition-colors ${type===value?'border-ink text-ink':'border-transparent text-muted hover:text-ink'}`}>{label} <span className="ml-1 text-xs font-normal">{count}</span></button>)}</div><p className="mb-4 hidden text-xs text-muted sm:block">{filtered.length} matching {type === 'images' ? 'images' : 'videos'}</p></div>
      <div className="my-6 hidden flex-wrap gap-2 md:flex" role="group" aria-label="Filter by product category">{['All',...categories].map(item => <button key={item} type="button" aria-pressed={activeCategory===item} onClick={() => changeCategory(item)} className={`min-h-11 border px-4 text-xs font-semibold transition-colors ${activeCategory===item?'border-ink bg-ink text-white':'border-stone-300 hover:border-ink'}`}>{item}</button>)}</div>
      <div className="my-5 flex items-center justify-between md:hidden"><span className="text-xs text-muted">{filtered.length} matching {type === 'images' ? 'images' : 'videos'}</span><button type="button" onClick={() => setSheetOpen(true)} className="inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-semibold"><SlidersHorizontal size={16}/> Filters {activeCategory !== 'All' ? '(1)' : ''}</button></div>
      <div id="gallery-panel" role="tabpanel" aria-labelledby={`gallery-tab-${type}`} tabIndex="0" className="outline-none"><div className="mb-6"><h2 className="font-serif text-3xl sm:text-4xl">{type === 'images' ? 'Images from the archive.' : 'Watch the work.'}</h2><p className="max-w-3xl text-sm leading-relaxed text-muted">{type === 'images' ? 'Original Instagram and Facebook product photos appear alongside Reel posters and YouTube thumbnails. Three marked campaign concepts were created for this site.' : 'Instagram Reels and YouTube videos play only when selected. Follow each item to its original post or related product.'}</p></div>
        {filtered.length ? <><div className="grid auto-rows-fr grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{shown.map(item => <MediaCard key={item.id} item={item} onOpen={openItem}/>)}</div>{shown.length < filtered.length && <div className="mt-12 text-center"><button type="button" onClick={() => setLimit(value => value+PAGE_SIZE)} className="min-h-12 border border-ink px-8 text-xs font-semibold transition-colors hover:bg-ink hover:text-white">Load more {type === 'images' ? 'images' : 'videos'}</button><p className="mt-3 text-xs text-muted">Showing {shown.length} of {filtered.length}</p></div>}</> : <div className="my-10 border border-stone-300 bg-sand px-6 py-12 text-center"><ImageIcon size={26} className="mx-auto mb-4 text-muted"/><h3 className="font-serif text-2xl">No media in this category.</h3><p className="text-sm text-muted">Choose another category to see more {type}.</p><button type="button" onClick={() => update({category:null})} className="mt-4 min-h-11 bg-ink px-5 text-xs font-semibold text-white">Show all media</button></div>}
      </div>
    </section>
    <FAQ entries={galleryFaqs}/><section className="bg-ink py-16 text-paper md:py-20"><div className="site-container mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-7 md:flex-row md:items-center md:justify-between md:px-10"><div><span className="text-xs font-bold uppercase tracking-widest text-gold-light">Your next piece</span><h2 className="mt-3 max-w-xl font-serif text-4xl">Have something similar in mind?</h2><p className="max-w-xl text-sm text-stone-300">Share a gallery link, product direction and your requirements. YellowCada can confirm what is possible now.</p></div><Link to="/contact" className="inline-flex min-h-12 w-max items-center gap-2 bg-gold-light px-6 text-xs font-semibold text-ink">Discuss your idea <ArrowUpRight size={17}/></Link></div></section>
    <FilterSheet open={sheetOpen} categories={categories} selected={activeCategory} onSelect={changeCategory} onClose={() => setSheetOpen(false)}/>
    <ImageLightbox items={filtered} index={imageIndex} onIndexChange={setImageIndex} onClose={() => setImageIndex(-1)}/>
    {playing && <MediaLightbox media={playing} product={productBySlug.get(galleryVideoItems.find(item => item.id === playing.id)?.productSlug)} onClose={() => setPlaying(null)}/>}
  </>;
}
