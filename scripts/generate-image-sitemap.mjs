import { catalogProducts } from '../src/data/catalogue.js';
import { featuredReels } from '../src/data/reels.js';
import { guides } from '../src/data/guides.js';
import { guideEnhancements } from '../src/data/guideEnhancements.js';
import { workNotes } from '../src/data/portfolioData.js';
import { officialPhotos } from '../src/data/officialPhotos.js';
import { readFile } from 'node:fs/promises';
import { origin, escapeXml, savePublic } from './seo-shared.mjs';

const image = (src,title,caption) => `<image:image><image:loc>${escapeXml(origin+src)}</image:loc><image:title>${escapeXml(title)}</image:title><image:caption>${escapeXml(caption)}</image:caption></image:image>`;
const reels = JSON.parse(await readFile(new URL('../research/instagram-reels.json',import.meta.url),'utf8'));
const youtube = JSON.parse(await readFile(new URL('../research/youtube-videos.json',import.meta.url),'utf8'));
const galleryImages = [
  ...officialPhotos.map(photo => ({ id:`post-${photo.id}`, title:photo.title, src:photo.image, caption:photo.caption })),
  ...reels.map(reel => ({ id:`instagram-${reel.id}`, title:reel.caption.split('\n')[0].slice(0,100) || 'YellowCada reel still', src:reel.poster, caption:reel.caption })),
  ...youtube.map(video => ({ id:`youtube-${video.id}`, title:video.title, src:video.thumbnail, caption:`Thumbnail from the official Yellow Cada YouTube video: ${video.title}` }))
];
const posterImages = ['fit','colour','personal'].map(slug => image(`/posters/${slug}-square.svg`,`${slug} campaign poster`,'Original YellowCada campaign poster concept.'));
const urls = [
  { route:'/', images:[image('/images/yellowcada-official-logo.jpg','YellowCada YCStraps official logo','Official YellowCada logo supplied for this website.'),image('/images/hero-two-leather-straps.webp','Two cognac leather watch strap halves','Illustrative buckle and adjustment strap pair shown without a watch.'),image('/images/cognac.svg','Customisable strap direction preview','Illustrative cognac leather watch strap design.'),...catalogProducts.filter(product => product.featured && product.image).map(product => image(product.image,product.name,product.shortDescription)),...featuredReels.map(r => image(r.poster,r.title,r.caption))] },
  { route:'/products', images:catalogProducts.filter(p => p.image).map(p => image(p.image,p.name,p.imageIsConcept ? 'Illustrative colour direction, not a confirmed product photograph.' : p.shortDescription)) },
  ...catalogProducts.filter(product => product.image || product.media.length).map(product => ({ route:`/products/${product.slug}`, images:[...(product.image ? [image(product.image,product.name,product.imageIsConcept ? 'Illustrative strap colour direction.' : product.shortDescription)] : []), ...product.photos.map(photo => image(photo.image,photo.title,photo.caption)), ...product.media.slice(0,4).map(media => image(media.image,`${product.name} archive video still`,media.title))] })),
  { route:'/about', images:[image('/videos/DckXiAiI_dW.jpg','Vintage cognac leather strap by YellowCada','Poster from a YellowCada Instagram reel showing vintage cognac leather.')] },
  { route:'/gallery',images:[...officialPhotos.map(photo => image(photo.image,photo.title,photo.caption)), ...reels.map(reel => image(reel.poster, reel.caption.split('\n')[0].slice(0,100) || 'YellowCada reel poster', reel.caption.slice(0,250) || 'YellowCada reel archive.')), ...youtube.map(video => image(video.thumbnail,video.title,`Official Yellow Cada YouTube video thumbnail: ${video.title}`)), ...posterImages] },
  { route:'/portfolio',images:workNotes.map(([id,title,caption]) => image(`/videos/${id}.jpg`,title,caption)) },
  { route:'/guides', images:guides.flatMap(guide => {
    const extra=guideEnhancements[guide.slug];
    return [image(extra.cover.src,guide.title,extra.cover.caption),...extra.images.slice(0,2).map(item => image(item.src,guide.title,item.caption))];
  }) },
  ...guides.map(guide => {
    const extra=guideEnhancements[guide.slug];
    return {route:`/guides/${guide.slug}`,images:[image(extra.cover.src,guide.title,extra.cover.caption),...extra.images.map(item => image(item.src,guide.title,item.caption))]};
  }),
  ...reels.map(reel => ({route:`/gallery/videos/${reel.id}`,images:[image(reel.poster,reel.caption.split('\n')[0].slice(0,100) || 'YellowCada reel still',reel.caption.slice(0,250) || 'YellowCada Instagram reel')]})),
  ...youtube.map(video => ({route:`/gallery/videos/${video.id}`,images:[image(video.thumbnail,video.title,`Official Yellow Cada YouTube video thumbnail: ${video.title}`)]})),
  ...galleryImages.map(item => ({route:`/gallery/images/${item.id}`,images:[image(item.src,item.title,item.caption.slice(0,250))]}))
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map(entry => `  <url><loc>${escapeXml(origin+entry.route)}</loc>${entry.images.join('')}</url>`).join('\n')}\n</urlset>\n`;
await savePublic('image-sitemap.xml',xml);
console.log('Generated image-sitemap.xml');
