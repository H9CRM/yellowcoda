import reelArchive from '../../research/instagram-reels.json' with { type: 'json' };
import youtubeArchive from '../../research/youtube-videos.json' with { type: 'json' };
import { officialPhotos } from './officialPhotos.js';

// Every entry below is supported by an official caption, video title, saved poster,
// public post note, or the @Ycstraps channel description. Media is archival evidence.
const definitions = [
  { slug: 'watch-straps', name: 'Handmade watch straps', category: 'Watch straps', shortDescription: 'Strap work shaped around a watch and its wearer.', description: 'YellowCada regularly shares handmade watch straps. The archive includes leather pieces described as vintage, Saffiano, suede and alligator, plus a poster labelled sail cloth. Send the watch reference and measurements for an individual conversation about fit, material and price.', applications: ['Watch personalisation'], materials: ['Material varies by archived piece; confirm per enquiry'], featured: true, mediaIds:['CaZhZRQgUqj'],
    conceptVariants: [
      { id:'cognac', name:'Cognac', hex:'#a75b31', image:'/images/cognac.svg' },
      { id:'midnight', name:'Midnight', hex:'#292825', image:'/images/midnight.svg' },
      { id:'olive', name:'Olive', hex:'#62664a', image:'/images/olive.svg' },
    ], related:['rally-straps','integrated-straps','apple-watch-straps'] },
  { slug: 'rally-straps', name: 'Rally & racing straps', category: 'Watch straps', shortDescription: 'A perforated, motorsport-inspired strap direction seen in the archive.', description: 'YellowCada captions and YouTube titles show rally and racing leather watch straps. Discuss the look, colour, watch reference and measured fit directly with the maker.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['Cl6QJDWAioJ','0zcvBTJhaFU','07rvzrInn9s'], related:['watch-straps','bund-straps','integrated-straps'] },
  { slug: 'integrated-straps', name: 'Integrated watch straps', category: 'Watch straps', shortDescription: 'Strap work shaped for an integrated watch case.', description: 'The official archive describes integrated leather straps and names particular watches as examples. Each watch case needs an individual fit check; those references do not imply a brand partnership.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['CfeJerqgj6N','7D3iP_BJs-s','Dc4CPxdB9GZ'], related:['watch-straps','bund-straps'] },
  { slug: 'bund-straps', name: 'Bund watch straps', category: 'Watch straps', shortDescription: 'A leather backing beneath the watch, shown in two YellowCada reels.', description: 'Two official reels identify Bund straps made for Rado watch references. This is an archived construction example; fit and present options are confirmed individually.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], mediaIds:['Cd8GOIlA_Xw','CdxW8nrgPg1'], related:['integrated-straps','watch-straps'] },
  { slug: 'nato-straps', name: 'Leather NATO straps', category: 'Watch straps', shortDescription: 'A NATO-style leather strap documented in the reel archive.', description: 'An official caption describes an alligator NATO strap. Ask YellowCada about current material options, dimensions and watch fit before making an enquiry.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], mediaIds:['CttesRvgogQ'], related:['watch-straps','rally-straps'] },
  { slug: 'apple-watch-straps', name: 'Apple Watch straps', category: 'Watch straps', shortDescription: 'Custom leather strap examples for Apple Watch appear in the archive.', description: 'Official reels and Shorts show Apple Watch strap work. Send the exact watch reference so YellowCada can assess connector fit and current options. Apple is named only as a watch reference.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['CYlutfFICl2','uhr-SOBALZk','8Xg9ewrjTo0','fiHxt1-YX7Y'], related:['watch-straps','integrated-straps'] },
  { slug: 'leather-wallets', name: 'Handmade leather wallets', category: 'Small leather goods', shortDescription: 'Handmade bifold and textured wallet examples from official posts.', description: 'YellowCada’s archive shows bifold wallets and pieces described as ostrich, crocodile and crazy horse leather. These are past examples rather than a promise of current material stock or identical specifications.', applications:['Everyday carry'], materials:['Leather (type varies by archived piece)'], featured:true, mediaIds:['Cg9HxZVAxfX','95DjplCADbo','CYEByAkovJ8','CYtWhSLI48D','CYBNtngosPE','CVVK_EjrJIW','CIQRFNTAwzG','CGZizW-Ah2S','CGXS_JQg1u2','drtqOxCXg7w'], related:['card-holders','pen-cases','passport-holders'] },
  { slug: 'card-holders', name: 'Handmade card holders', category: 'Small leather goods', shortDescription: 'Compact hand-finished card holders shown in reels and Shorts.', description: 'Official YellowCada posts and a YouTube Short show leather card holders. The posts document previous work; ask for current dimensions, configuration and price.', applications:['Everyday carry'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['CiHw6AOAVS1','Ch2DtNsg2Y-','mWmgBDpelWU'], related:['leather-wallets','pen-cases'] },
  { slug: 'pen-cases', name: 'Leather pen cases', category: 'Small leather goods', shortDescription: 'A two-pen leather case documented in an official reel.', description: 'An official YellowCada reel identifies a leather case for two pens. Share the post as a reference, then ask the maker to confirm current dimensions, materials and price.', applications:['Writing instrument storage'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['DLkfSFTzX3D'], related:['card-holders','leather-wallets'] },
  { slug: 'watch-pouches', name: 'Leather watch pouches', category: 'Accessories', shortDescription: 'Handmade leather watch pouches photographed in an official YellowCada carousel.', description: 'YellowCada’s three-image Instagram post shows past watch pouch work in tan and muted green, including an open pouch and close details of the leather and stitching. Share your watch dimensions, the number of watches to store and a preferred colour or closure reference. YellowCada can confirm the current construction, lining, fit and price before a new piece is agreed.', applications:['Watch storage'], materials:['Leather (type confirmed per enquiry)'], sourceNote:'Official YellowCada watch pouch Instagram carousel', sourceUrl:'https://www.instagram.com/p/DKdzpIxC8_s/', related:['watch-straps','pen-cases'] },
  { slug: 'leather-belts', name: 'Leather belts', category: 'Accessories', shortDescription: 'Handmade leather belts listed by YellowCada and photographed in its archive.', description: 'YellowCada’s YouTube channel names belts among its handmade leather products. An official eight-image Instagram carousel documents one vegetable-tanned leather belt in several views, including the full length and buckle. For a new belt, discuss the desired length, width, leather shade and buckle finish; present materials, sizing, price and timing require direct confirmation.', applications:['Personal accessories'], materials:['Leather (type confirmed per enquiry)'], sourceNote:'Official YellowCada belt Instagram carousel and @Ycstraps channel description', sourceUrl:'https://www.instagram.com/p/CzpzicbCo_L/', related:['vegetable-tan-belt','leather-wallets'] },
  { slug: 'passport-holders', name: 'Leather passport holders', category: 'Accessories', shortDescription: 'Listed by YellowCada in the official YouTube channel description.', description: 'YellowCada lists passport holders among its handmade leather products. No specific design, size or product image is confirmed in the saved media.', applications:['Travel'], materials:['Leather (type confirmed per enquiry)'], sourceNote:'Official @Ycstraps channel description', related:['leather-wallets','laptop-sleeves'] },
  { slug: 'laptop-sleeves', name: 'Leather laptop sleeves', category: 'Accessories', shortDescription: 'Listed by YellowCada in the official YouTube channel description.', description: 'YellowCada lists laptop sleeves on its official YouTube channel. Dimensions, construction, device fit and current availability need direct confirmation.', applications:['Device carry'], materials:['Leather (type confirmed per enquiry)'], sourceNote:'Official @Ycstraps channel description', related:['passport-holders','leather-belts'] },
  { slug: 'stitched-watch-straps', name: 'Hand-stitched watch straps', category: 'Watch straps', shortDescription: 'Distinctive Spanish and minimal stitch work from official YellowCada reels.', description: 'Official reels document Spanish stitching, minimal stitch and hand-stitched watch straps. These archived examples show workmanship, while a new strap needs its own watch reference, measurements, material and colour confirmation.', applications:['Watch personalisation'], materials:['Leather (type confirmed per enquiry)'], featured:true, mediaIds:['CWGNBv2APb5','CV78ySug7NA','CTzcfOXA46K','CIPI7p5Ae4P'], related:['watch-straps','rally-straps'] },
  { slug: 'vegetable-tan-belt', name: 'Top Notch vegetable-tan belt', category: 'Accessories', shortDescription: 'A photographed YellowCada belt described in its original caption as vegetable-tanned leather.', description: 'The original YellowCada Instagram caption calls this a “Top Notch vegetable tan belt.” Its carousel shows a tan leather belt, adjustment holes, stitching and a brass-coloured buckle from several angles. The post confirms a past design, not a current stock item or a fixed specification. Share a comfortable existing-belt measurement and preferred width, colour and buckle direction so the maker can confirm a new belt and quote.', applications:['Personal accessories'], materials:['Vegetable-tanned leather in the archived example; confirm current leather'], sourceNote:'Official YellowCada “Top Notch vegetable tan belt” Instagram post', sourceUrl:'https://www.instagram.com/p/CzpzicbCo_L/', related:['leather-belts','leather-wallets'] },
  { slug: 'land-cruiser-smart-key-accessory', name: '2013 Toyota Land Cruiser smart-key accessory', category: 'Accessories', shortDescription: 'A customer-supplied social-media reference for a smart-key item.', description: 'The 2013 Toyota Land Cruiser Smart Keyless Entry item was supplied as a social-media product reference. The exact item, construction and vehicle compatibility have not been verified from an original YellowCada post. Share the source or key photograph with YellowCada so the correct accessory can be identified before any quote. Toyota is a vehicle reference, not an affiliation.', applications:['Vehicle key carry'], materials:['Material to confirm'], sourceNote:'Customer-supplied social-media product reference; original post link pending', sourceUrl:'https://www.instagram.com/yellowcada/', verification:'reference-to-confirm', related:['watch-pouches','leather-wallets'] },
  { slug: 'womens-bags', name: "Women's bags", category: 'Bags', shortDescription: 'A bag category reported from YellowCada social media; style to confirm.', description: 'Women’s bags were supplied as a YellowCada social-media find. This site does not yet have the original post, product photograph, dimensions or materials. Discuss the preferred bag style and share the source post so the maker can confirm current options and a quote.', applications:['Everyday carry'], materials:['Material to confirm'], sourceNote:'Customer-supplied social-media product reference; original post link pending', sourceUrl:'https://www.instagram.com/yellowcada/', verification:'reference-to-confirm', related:['leather-wallets','card-holders'] },
];

const fixedMedia = new Map(definitions.flatMap(product => (product.mediaIds || []).map(id => [id, product.slug])));
export function productSlugForMedia(item) {
  if (fixedMedia.has(item.id)) return fixedMedia.get(item.id);
  // Hashtag lists often mention unrelated strap types; classify the written subject only.
  const text = (item.caption || item.title || '').split(/\n|#/)[0].toLowerCase();
  if (!(item.caption || item.title || '').trim()) return null;
  if (/pen case|pencase/.test(text)) return 'pen-cases';
  if (/card.?holder|cardwallet/.test(text)) return 'card-holders';
  if (/wallet|bifold|bi-fold/.test(text)) return 'leather-wallets';
  if (/bund.?strap/.test(text)) return 'bund-straps';
  if (/nato strap/.test(text)) return 'nato-straps';
  if (/integrated strap/.test(text)) return 'integrated-straps';
  if (/apple watch|applewatch|applestrap/.test(text) && !/rolex|panerai|seiko/.test(text)) return 'apple-watch-straps';
  if (/rally|racingstrap|racing strap/.test(text)) return 'rally-straps';
  if (/strap|watch/.test(text)) return 'watch-straps';
  if (/strap|watch/.test((item.caption || item.title || '').toLowerCase())) return 'watch-straps';
  return null;
}

export const catalogMedia = [
  ...reelArchive.map(item => ({ ...item, mediaType:'Instagram reel', image:item.poster, title:item.caption?.split('\n')[0]?.trim() || 'YellowCada reel' })),
  ...youtubeArchive.map(item => ({ ...item, mediaType:'YouTube video', image:item.thumbnail })),
].map(item => ({ ...item, productSlug:productSlugForMedia(item) }));

export const catalogProducts = definitions.map((item, index) => {
  const media = catalogMedia.filter(entry => entry.productSlug === item.slug);
  const photos = officialPhotos.filter(photo => photo.productSlug === item.slug || photo.relatedSlugs?.includes(item.slug));
  const image = item.imageOverride || photos[0]?.image || media[0]?.image || null;
  return {
    ...item, id:`catalog-${index+1}`, price:null, pricingType:'enquiry', media, photos,
    image, imageIsConcept:Boolean(item.conceptImage),
    imageAlt:item.conceptImage ? `${item.name}, illustrative cognac strap direction` : photos[0]?.alt || (image ? `${item.name}, still from YellowCada's official ${media[0].mediaType}` : null),
    variants:item.conceptVariants || [],
    evidence:[...photos.map(photo => photo.source), ...media.map(entry => entry.source), ...(item.sourceNote ? [item.sourceNote] : [])],
  };
});

export const catalogCategories = ['All products', ...new Set(catalogProducts.map(item => item.category))];
export const catalogStats = {
  products:catalogProducts.length,
  categories:catalogCategories.length-1,
  withPhotos:catalogProducts.filter(item => item.image).length,
  withVideos:catalogProducts.filter(item => item.media.some(media => media.mediaType === 'YouTube video')).length,
  withReels:catalogProducts.filter(item => item.media.some(media => media.mediaType === 'Instagram reel')).length,
  multiColour:0, // The three illustrated directions are not verified orderable colour variants.
  lackingDetail:catalogProducts.filter(item => !item.media.length && !item.photos.length).length,
  associatedMedia:catalogMedia.filter(item => item.productSlug).length,
  unassignedMedia:catalogMedia.filter(item => !item.productSlug).length,
};
