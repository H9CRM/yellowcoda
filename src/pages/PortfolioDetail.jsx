import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CTA from '../components/common/CTA';
import NotFound from './NotFound';
import { portfolio } from '../data/mediaLibrary';
import { catalogProducts, productSlugForMedia } from '../data/catalogue';
import { absoluteUrl } from '../utils/seoHelpers';
import { webpageSchema, breadcrumbSchema } from '../utils/schemaHelpers';

export default function PortfolioDetail() {
  const { id } = useParams();
  const item = portfolio.find(entry => entry.id === id);
  if (!item) return <NotFound/>;
  const relatedProduct = catalogProducts.find(product => product.slug === productSlugForMedia(item));
  const path = `/portfolio/${id}`;
  const videoSchema = { '@context':'https://schema.org', '@type':'VideoObject', name:item.title, description:item.summary, thumbnailUrl:absoluteUrl(item.poster), contentUrl:absoluteUrl(item.video), uploadDate:item.date, url:absoluteUrl(path) };
  return <><SEO title={item.title} path={path} description={item.summary} image={item.poster} robots="noindex,follow" schema={[webpageSchema(path,item.title,item.summary),breadcrumbSchema([{name:'Home',path:'/'},{name:'Selected work',path:'/portfolio'},{name:item.title,path}]),videoSchema]}/><div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><Breadcrumbs items={[{name:'Selected work',path:'/portfolio'},{name:item.title}]}/></div><section className="page-intro pt-16 pb-12 md:pt-24 md:pb-20 site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">{item.category} / work note</span><h1>{item.title}</h1><p className="answer-block max-w-3xl text-lg leading-relaxed text-muted"><strong>In short:</strong> {item.summary}</p></section><section className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 work-detail grid gap-10 min-[900px]:grid-cols-[1.1fr_.9fr] min-[900px]:gap-16 section-space py-16 md:py-24 xl:py-28"><div className="work-video grid min-h-[440px] place-items-center bg-ink"><video controls preload="none" playsInline poster={item.poster} aria-label={`${item.title} YellowCada reel`}><source src={item.video} type="video/mp4"/>Your browser does not support video.</video></div><div className="work-copy"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">From the official archive</span><h2>What the post shows.</h2><p>{item.summary}</p><h3>Original caption</h3><blockquote>{item.caption || 'This reel has no public caption in the saved archive.'}</blockquote><p>Posted {item.date || 'on Instagram'}. This work note records visible material from the post; project brief, client outcome and present availability have not been supplied.</p><a className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3" href={item.source} target="_blank" rel="noreferrer">View original reel <ArrowUpRight size={16}/></a>{relatedProduct && <Link className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3" to={`/products/${relatedProduct.slug}`}>Explore {relatedProduct.name} <ArrowUpRight size={16}/></Link>}<Link className="text-link inline-flex w-max items-center gap-2 border-b border-current pb-1.5 text-sm font-semibold transition-[gap] duration-200 hover:gap-3" to="/about#craft">How custom craft works <ArrowUpRight size={16}/></Link></div></section><CTA/></>;
}
