import { workNotes } from './portfolioData.js';
import { guides } from './guides.js';
import { videos, galleryImages } from './mediaLibrary.js';
import { catalogProducts } from './catalogue.js';
export const publicRoutes = ['/', '/products', '/about', '/faq', '/contact', '/portfolio', '/gallery', '/guides', ...catalogProducts.map(p => `/products/${p.slug}`), ...guides.map(item => `/guides/${item.slug}`), ...videos.map(item => `/gallery/videos/${item.id}`), ...galleryImages.map(item => `/gallery/images/${item.id}`)];
export const utilityRoutes = ['/shop', ...workNotes.map(item => `/portfolio/${item[0]}`), '/cart', '/checkout', '/track-order', '/privacy', '/404'];
export const allRoutes = [...publicRoutes, ...utilityRoutes];
