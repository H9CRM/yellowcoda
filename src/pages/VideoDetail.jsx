import { sitePath } from '../utils/sitePath';
import { buttonClass } from '../components/common/buttonStyles';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import FAQ from '../components/common/FAQ';
import NotFound from './NotFound';
import YouTubePlayer from '../components/ui/YouTubePlayer';
import { videos, galleryImages } from '../data/mediaLibrary';
import { catalogProducts, productSlugForMedia } from '../data/catalogue';
import { siteConfig } from '../data/siteConfig';
import { absoluteUrl } from '../utils/seoHelpers';
import { webpageSchema, breadcrumbSchema, faqSchema } from '../utils/schemaHelpers';

const questions = [
  { question:'Can I enquire about a piece shown in an archive video?', answer:'Yes. Send YellowCada the video link and your watch reference or preferred item. The maker must confirm current materials, fit, price and availability.' },
  { question:'Is a video a current product listing?', answer:'No. These videos document work shared on official channels. They do not confirm current stock or guarantee an identical commission.' },
];

export default function VideoDetail() {
  const { id } = useParams();
  const index = videos.findIndex(item => item.id === id);
  if (index < 0) return <NotFound/>;
  const item = videos[index];
  const relatedProduct = catalogProducts.find(product => product.slug === productSlugForMedia(item));
  const path = `/gallery/videos/${item.id}`;
  const previous = videos[(index - 1 + videos.length) % videos.length];
  const next = videos[(index + 1) % videos.length];
  const related = [...galleryImages.filter(image => image.videoId === id), ...galleryImages.filter(image => image.category === item.category && image.videoId !== id)].slice(0,4);
  const description = `${item.displayTitle}. Watch this ${item.platform} archive video from YellowCada, read its source details and explore related gallery stills.`;
  const videoSchema = { '@context':'https://schema.org', '@type':'VideoObject', name:item.displayTitle, description:item.caption || item.title || description, thumbnailUrl:absoluteUrl(item.poster), publisher:{'@type':'Organization',name:siteConfig.name}, ...(item.date ? {uploadDate:item.date} : {}), ...(item.platform === 'YouTube' ? {embedUrl:`https://www.youtube.com/embed/${item.id}`} : {contentUrl:absoluteUrl(item.video)}) };
  return <><SEO title={`${item.displayTitle} Video`} path={path} description={description} image={item.poster} schema={[webpageSchema(path,item.displayTitle,description),breadcrumbSchema([{name:'Home',path:'/'},{name:'Gallery',path:'/gallery'},{name:item.displayTitle,path}]),videoSchema,faqSchema(questions)]}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Gallery',path:'/gallery'},{name:item.displayTitle}]}/></div>
    <article className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 media-detail max-w-[1100px] section-space py-16 md:py-24 xl:py-28"><div className="media-detail-copy mb-10 max-w-[850px]"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">{item.platform} video · {item.category}</span><h1>{item.displayTitle}</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> This video is part of the public YellowCada archive. Use it as a reference for an enquiry; the maker will confirm what can be made today.</p></div><div className={`media-stage flex min-h-[300px] items-center justify-center overflow-hidden bg-ink sm:min-h-[420px] ${item.kind === 'short' ? 'media-stage-short' : ''}`}>{item.platform === 'YouTube' ? <YouTubePlayer item={item}/> : <video controls playsInline preload="metadata" poster={sitePath(item.poster)} aria-label={item.displayTitle}><source src={sitePath(item.video)} type="video/mp4"/>Your browser does not support video.</video>}</div><div className="media-detail-notes flex flex-col items-start gap-6 border-b border-stone-300 py-10 md:flex-row md:justify-between"><div><h2>About this archive video</h2><p>{item.platform === 'Instagram' ? 'This reel was saved from YellowCada’s official Instagram profile. The original caption is shown below, exactly as archived.' : 'This video is presented from the public Yellow Cada YouTube channel. The title and thumbnail are channel metadata; its player remains hosted by YouTube.'}</p><blockquote>{item.caption || item.title || 'No written description was available with this video.'}</blockquote>{relatedProduct && <p><Link to={`/products/${relatedProduct.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Explore {relatedProduct.name} <ArrowUpRight size={16}/></Link></p>}<p className="media-disclosure">An archive video is a visual reference. It does not establish current material availability, a watch fit, a final price or delivery timing.</p></div><a href={sitePath(item.source)} target="_blank" rel="noreferrer" className={buttonClass('outline')}>Open original {item.platform} video <ArrowUpRight size={17}/></a></div>
      <nav className="media-pagination mt-6 grid grid-cols-2 gap-3" aria-label="Browse videos"><Link to={`/gallery/videos/${previous.id}`} rel="prev"><ArrowLeft size={18}/><span><small>Previous video</small>{previous.displayTitle}</span></Link><Link to={`/gallery/videos/${next.id}`} rel="next"><span><small>Next video</small>{next.displayTitle}</span><ArrowRight size={18}/></Link></nav></article>
    <section className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 section-space py-16 md:py-24 xl:py-28 related-stills"><div className="section-top mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Image gallery</span><h2>Explore related stills.</h2><p>Open a larger archive image and move through the gallery.</p></div><Link to="/gallery#images" className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3">All images <ArrowUpRight size={16}/></Link></div><div className="related-image-grid grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(image => <Link key={image.id} to={`/gallery/images/${image.id}`}><img src={sitePath(image.image)} alt={image.alt} width="320" height="400" loading="lazy"/><span><ImageIcon size={15}/>{image.title}</span></Link>)}</div></section><FAQ entries={questions}/>
  </>;
}
