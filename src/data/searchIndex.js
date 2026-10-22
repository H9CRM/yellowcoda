import { catalogProducts } from './catalogue.js';
import { guides } from './guides.js';
import { guideEnhancements } from './guideEnhancements.js';
import { videos, galleryImages } from './mediaLibrary.js';
import { faqs } from './faqs.js';

const staticPages = [
  { title:'Our story & craft', description:'Explore YellowCada watch strap making, archive materials and the made-to-order enquiry process.', href:'/about', image:'/videos/DckXiAiI_dW.jpg', terms:'about atelier craftsmanship leather' },
  { title:'All products', description:'Browse watch straps, wallets, card holders, accessories and bags.', href:'/products', image:'/videos/CiHw6AOAVS1.jpg', terms:'collection catalogue shop' },
  { title:'Gallery', description:'Browse original Instagram Reel stills and YouTube video thumbnails from YellowCada.', href:'/gallery', image:'/videos/Dda_Wofouan.jpg', terms:'photos pictures videos reels instagram facebook archive' },
  { title:'Selected work', description:'A closer look at documented YellowCada leather work.', href:'/portfolio', image:'/videos/DLkfSFTzX3D.jpg', terms:'portfolio projects' },
  { title:'Contact YellowCada', description:'Send watch measurements, product references and questions for a direct enquiry.', href:'/contact', image:null, terms:'enquire enquiry quote price order buy help' },
  { title:'Enquiry bag', description:'Review selected products together before sending a quote request. No payment is collected.', href:'/cart', image:null, terms:'cart bag checkout buy selected products' },
];

export const searchIndex = [
  ...catalogProducts.map(item => ({ type:'Product', title:item.name, description:item.shortDescription, href:`/products/${item.slug}`, image:item.image, terms:[item.category, item.description, ...item.materials, ...item.applications, item.slug.replaceAll('-', ' ')].join(' ') })),
  ...guides.map(item => ({ type:'Guide', title:item.title, description:item.description, href:`/guides/${item.slug}`, image:guideEnhancements[item.slug].cover.src, terms:[item.eyebrow, item.answer, guideEnhancements[item.slug].primaryKeyword, ...guideEnhancements[item.slug].keywords, ...item.sections.map(section => section.heading)].join(' ') })),
  ...videos.map(item => ({ type:'Video', title:item.displayTitle || item.title, description:(item.caption || item.title || '').replace(/#\S+/g, '').slice(0, 180), href:`/gallery/videos/${item.id}`, image:item.poster || item.thumbnail, terms:[item.caption, item.category, item.platform, item.title].join(' ') })),
  ...galleryImages.map(item => ({ type:'Image', title:item.title, description:item.kind?.includes('product photo') ? `Original ${item.platform} product photo. Open for source and related products.` : `${item.platform} archive still. Open for source and related video.`, href:`/gallery/images/${item.id}`, image:item.image, terms:[item.caption, item.category, item.platform].join(' ') })),
  ...faqs.map(item => ({ type:'Answer', title:item.question, description:item.answer, href:'/faq', image:null, terms:item.answer })),
  ...staticPages.map(item => ({ type:'Page', ...item })),
];

const normalize = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const words = value => normalize(value).split(' ').filter(Boolean);

function closeWord(term, target) {
  if (target.includes(term) || term.includes(target) && target.length > 3) return true;
  if (term.length < 4 || Math.abs(term.length - target.length) > 1) return false;
  let edits = 0; let i = 0; let j = 0;
  while (i < term.length && j < target.length) {
    if (term[i] === target[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (term.length > target.length) i++;
    else if (target.length > term.length) j++;
    else { i++; j++; }
  }
  return edits + (term.length - i) + (target.length - j) <= 1;
}

export function searchSite(query, type = 'All') {
  const tokens = words(query).slice(0, 8);
  if (!tokens.length) return [];
  return searchIndex.map(item => {
    if (type !== 'All' && type !== item.type) return null;
    const title = normalize(item.title);
    const description = normalize(item.description);
    const terms = normalize(item.terms);
    const allWords = words(`${item.title} ${item.description} ${item.terms}`);
    let score = title.includes(tokens.join(' ')) ? 12 : 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 8;
      else if (description.includes(token)) score += 3;
      else if (terms.includes(token)) score += 2;
      else if (allWords.some(word => closeWord(token, word))) score += 1;
      else return null;
    }
    if (item.type === 'Product') score += 2;
    return { ...item, score };
  }).filter(Boolean).sort((a,b) => b.score - a.score || a.title.localeCompare(b.title));
}

export const searchTypes = ['All', 'Product', 'Guide', 'Video', 'Image', 'Answer', 'Page'];
