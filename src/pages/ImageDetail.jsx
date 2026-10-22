import { sitePath } from '../utils/sitePath';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import { buttonClass } from '../components/common/buttonStyles';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import FAQ from '../components/common/FAQ';
import NotFound from './NotFound';
import { galleryImages, videos } from '../data/mediaLibrary';
import { catalogProducts, productSlugForMedia } from '../data/catalogue';
import { webpageSchema, breadcrumbSchema, faqSchema, imageSchema } from '../utils/schemaHelpers';

export default function ImageDetail() {
  const { id } = useParams();
  const index = galleryImages.findIndex(item => item.id === id);
  if (index < 0) return <NotFound/>;
  const item = galleryImages[index];
  const sourceVideo = videos.find(video => video.id === item.videoId);
  const isPhoto = item.kind?.includes('product photo');
  const relatedProduct = catalogProducts.find(product => product.slug === (item.productSlug || productSlugForMedia(sourceVideo || {})));
  const previous = galleryImages[(index - 1 + galleryImages.length) % galleryImages.length];
  const next = galleryImages[(index + 1) % galleryImages.length];
  const path = `/gallery/images/${item.id}`;
  const description = `${item.title}. View this official YellowCada ${isPhoto ? `${item.platform} product photo` : 'archive still'}, its original source and related work.`;
  const questions = [
    { question:'Is this image a current product photograph?', answer:isPhoto ? `This photo came from YellowCada’s ${item.platform} page. It documents past work; ask the maker to confirm current materials, design details and availability.` : 'It is a still or thumbnail from an official YellowCada archive video. Ask the maker about current materials, product details and availability.' },
    { question:'Can I request a design inspired by this image?', answer:'Yes. Include the image or its source link in your enquiry and explain which colour, texture or shape you like. YellowCada can confirm feasibility.' },
  ];

  return <>
    <SEO title={`${item.title} Image`} path={path} description={description} image={item.image} schema={[webpageSchema(path,item.title,description),breadcrumbSchema([{name:'Home',path:'/'},{name:'Gallery',path:'/gallery'},{name:item.title,path}]),imageSchema(item.title,item.image,item.caption || description),faqSchema(questions)]}/>
    <div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Gallery',path:'/gallery'},{name:item.title}]}/></div>
    <article className="site-container mx-auto grid w-full max-w-[1100px] gap-10 px-4 py-16 sm:px-7 md:px-10 md:py-24">
      <div className="max-w-[850px]"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">Image gallery · {item.platform}</span><h1 className="mt-4 text-5xl leading-[1.04] sm:text-6xl lg:text-7xl">{item.title}</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> {isPhoto ? 'An original product photograph from YellowCada’s Instagram archive.' : 'A still or thumbnail associated with an official YellowCada video.'} Use it as a visual reference for a new enquiry; current stock and materials are confirmed directly.</p></div>
      <div className="image-stage grid min-h-[300px] place-items-center bg-ink-soft sm:min-h-[420px]"><img src={sitePath(item.image)} alt={item.alt} width="900" height="1125" className="max-h-[75dvh] w-auto max-w-full object-contain"/></div>
      <div className="media-detail-notes flex flex-col items-start gap-6 border-b border-stone-300 pb-10 md:flex-row md:justify-between"><div><h2>Image and source</h2><p>{isPhoto ? `This photograph appears on YellowCada’s ${item.platform} page.` : item.platform === 'Instagram' ? 'This still is the poster image from an archived YellowCada Instagram reel.' : 'This image is the thumbnail saved from the public YellowCada YouTube channel.'} It records past work and may differ from materials available now.</p><blockquote>{item.caption || 'No caption was available with this image.'}</blockquote>{relatedProduct && <p><Link to={`/products/${relatedProduct.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Explore {relatedProduct.name} <ArrowUpRight size={16}/></Link></p>}</div><div className="media-source-links flex flex-wrap items-center gap-5">{sourceVideo && <Link to={`/gallery/videos/${item.videoId}`} className={buttonClass('dark')}><Play size={16}/> Watch source video</Link>}<a href={sitePath(item.source)} target="_blank" rel="noreferrer" className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3">View original on {item.platform} <ArrowUpRight size={16}/></a></div></div>
      <nav className="media-pagination grid grid-cols-2 gap-3" aria-label="Browse images"><Link to={`/gallery/images/${previous.id}`} rel="prev"><ArrowLeft size={18}/><span><small>Previous image</small>{previous.title}</span></Link><Link to={`/gallery/images/${next.id}`} rel="next"><span><small>Next image</small>{next.title}</span><ArrowRight size={18}/></Link></nav>
    </article>
    <FAQ entries={questions}/>
  </>;
}
