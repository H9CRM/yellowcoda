import { siteConfig } from '../data/siteConfig';
export const absoluteUrl = path => /^(https?:)?\/\//.test(path) ? path : `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
export const pageTitle = title => `${title} | ${siteConfig.name}`;
