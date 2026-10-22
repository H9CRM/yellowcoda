import { buttonClass } from '../components/common/buttonStyles';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { webpageSchema } from '../utils/schemaHelpers';
export default function NotFound() { return <><SEO title="Page Not Found" path="/404" robots="noindex,nofollow" schema={webpageSchema('/404','Page not found','The requested YellowCada page was not found.')}/><section className="site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 not-found flex min-h-[65vh] flex-col items-start justify-center"><span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">A different direction</span><h1>Page not found.</h1><p>This page is not in the collection. Let’s get you back to the atelier.</p><Link to="/products" className={buttonClass('dark')}>Explore products →</Link></section></>; }

