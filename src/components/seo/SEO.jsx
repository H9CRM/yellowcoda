import { sitePath } from '../../utils/sitePath';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../data/siteConfig';
import { absoluteUrl, pageTitle } from '../../utils/seoHelpers';

export default function SEO({ title, description = siteConfig.description, path = '/', image = siteConfig.ogImage, ogTitle, ogDescription, ogImage, ogUrl, twitterCard = 'summary_large_image', robots, schema = [] }) {
  const fullTitle = pageTitle(title);
  const canonical = absoluteUrl(path);
  const structured = Array.isArray(schema) ? schema : [schema];
  return <Helmet>
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={robots || (siteConfig.launchReady ? 'index,follow,max-image-preview:large' : 'noindex,nofollow')} />
    <link rel="canonical" href={sitePath(canonical)} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteConfig.name} />
    <meta property="og:title" content={ogTitle || fullTitle} />
    <meta property="og:description" content={ogDescription || description} />
    <meta property="og:url" content={ogUrl || canonical} />
    <meta property="og:image" content={absoluteUrl(ogImage || image)} />
    <meta name="twitter:card" content={twitterCard} />
    <meta name="twitter:title" content={ogTitle || fullTitle} />
    <meta name="twitter:description" content={ogDescription || description} />
    {structured.filter(Boolean).map((item, index) => <script key={index} type="application/ld+json">{JSON.stringify(item).replace(/</g, '\\u003c')}</script>)}
  </Helmet>;
}
