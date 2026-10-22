import { galleryImages, videos } from './mediaLibrary.js';
import { catalogMedia, catalogProducts } from './catalogue.js';

const productBySlug = new Map(catalogProducts.map(product => [product.slug, product]));
const archiveById = new Map(catalogMedia.map(item => [item.id, item]));
const productFor = id => productBySlug.get(archiveById.get(id)?.productSlug);

const imageItems = galleryImages.map(item => {
  const product = productBySlug.get(item.productSlug) || productFor(item.videoId);
  return {
    id:item.id, type:'image', title:item.title, category:product?.category || item.category,
    tags:[item.platform, item.category, product?.name].filter(Boolean),
    thumbnail:item.image, image:item.image, alt:item.alt, caption:item.caption,
    source:item.source, productSlug:product?.slug || null, productName:product?.name || null,
    detailPath:`/gallery/images/${item.id}`, kind:item.kind || `${item.platform} archive still`,
  };
});

const posterTitles = {
  fit:'A better fit starts here',
  colour:'A new colour for your watch',
  personal:'Make it personal',
};
const conceptItems = Object.entries(posterTitles).map(([slug,title]) => ({
  id:`concept-${slug}`, type:'image', title, category:'Campaign concepts',
  tags:['poster','campaign','illustrative concept','watch straps'],
  thumbnail:`/posters/${slug}-square.svg`, image:`/posters/${slug}-portrait.svg`,
  alt:`${title}, original YellowCada campaign poster concept`,
  caption:'Illustrative campaign poster created for this website. It is not a client project or a product photograph.',
  source:null, productSlug:'watch-straps', productName:'Handmade watch straps',
  detailPath:null, kind:'Original campaign concept',
}));

const videoItems = videos.map(item => {
  const product = productFor(item.id);
  const reel = item.platform === 'Instagram';
  return {
    id:item.id, type:reel ? 'reel' : 'video', title:item.displayTitle,
    category:product?.category || item.category,
    tags:[item.platform, item.category, product?.name].filter(Boolean),
    thumbnail:item.poster, image:item.poster,
    alt:`${item.displayTitle} — ${reel ? 'Instagram Reel' : 'YouTube video'} poster from YellowCada`,
    caption:item.caption || item.title, source:item.source, productSlug:product?.slug || null,
    productName:product?.name || null, detailPath:`/gallery/videos/${item.id}`,
    kind:reel ? 'Instagram Reel' : 'YouTube video', original:{...item, mediaType:reel ? 'Instagram reel' : 'YouTube video', image:item.poster, title:item.displayTitle},
  };
});

export const galleryCollection = [...imageItems, ...conceptItems, ...videoItems];
export const galleryImageItems = [...imageItems, ...conceptItems];
export const galleryVideoItems = videoItems;
export const galleryCategories = items => [...new Set(items.map(item => item.category).filter(Boolean))];
export const galleryMatches = (item, query) => {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = [item.title,item.category,item.productName,item.caption,item.kind,...item.tags].filter(Boolean).join(' ').toLocaleLowerCase();
  return words.every(word => haystack.includes(word));
};
