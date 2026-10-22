import { siteConfig } from '../data/siteConfig';
import { absoluteUrl } from './seoHelpers';
import { officialContactPoint } from '../data/schemaData';

export const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', name: siteConfig.name,
  url: absoluteUrl('/'), logo: absoluteUrl(siteConfig.logo), sameAs: [siteConfig.instagram,siteConfig.facebook,siteConfig.youtube],
  description: siteConfig.description, contactPoint: officialContactPoint
};
export const websiteSchema = {
  '@context': 'https://schema.org', '@type': 'WebSite', name: siteConfig.name,
  url: absoluteUrl('/'), description: siteConfig.description
};
export const webpageSchema = (path, title, description) => ({
  '@context': 'https://schema.org', '@type': 'WebPage', name: title, description,
  url: absoluteUrl(path), isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: absoluteUrl('/') }
});
export const faqSchema = entries => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entries.map(({question,answer}) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
export const breadcrumbSchema = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })) });
export const serviceSchema = (name, description, path) => ({ '@context': 'https://schema.org', '@type': 'Service', name, description, url: absoluteUrl(path), provider: { '@type': 'Organization', name: siteConfig.name } });
export const imageSchema = (name, path, caption) => ({ '@context': 'https://schema.org', '@type': 'ImageObject', name, contentUrl: absoluteUrl(path), caption });
