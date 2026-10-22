import { writeFile } from 'node:fs/promises';
import { catalogMedia, catalogProducts, catalogStats } from '../src/data/catalogue.js';

const mediaBacked = catalogProducts.filter(product => product.media.length);
const lines = [
  '# YellowCada product inventory',
  '',
  'This inventory combines saved official Instagram Reel captions and poster stills, official Instagram product photographs, official YouTube titles and thumbnails, the public Instagram post notes, the @Ycstraps channel description, and additional product names supplied by the user. References without an original post are flagged below. These sources do not establish current stock or price.',
  '',
  '## Counts',
  '',
  `- Catalogue product types and references: **${catalogStats.products}**`,
  `- References awaiting an original post: **${catalogProducts.filter(product => product.verification === 'reference-to-confirm').length}**`,
  `- Categories: **${catalogStats.categories}**`,
  `- Product types with archive photos/stills: **${catalogStats.withPhotos}**`,
  `- Product types with YouTube videos: **${catalogStats.withVideos}**`,
  `- Product types with Instagram Reels: **${catalogStats.withReels}**`,
  `- Products with verified multiple orderable colours: **${catalogStats.multiColour}**`,
  `- Product types without dedicated saved video or image: **${catalogStats.lackingDetail}**`,
  `- Media records associated with a product type: **${catalogStats.associatedMedia}**`,
  `- Media records not assigned for insufficient identification: **${catalogStats.unassignedMedia}**`,
  `- Additional media posts grouped under an existing product type: **${catalogStats.associatedMedia - mediaBacked.length}**`,
  '- Exact duplicate media IDs found: **0**',
  '',
  'The three strap drawings labelled Cognac, Midnight and Olive are sample design directions. They are interactive on the site, but they are not counted as verified orderable colour variants. No other colour set was asserted without product-level confirmation.',
  'The uncaptioned Reel CaZhZRQgUqj is assigned to watch straps from its saved poster, which visibly shows a watch and strap. Its material, style and colour are left unspecified. The Dc4CPxdB9GZ poster explicitly labels an integrated custom strap.',
  '',
  '## Product records',
  '',
  '| Product | Category | Evidence | Stills | Instagram Reels | YouTube videos | Known use | Open questions |',
  '| --- | --- | --- | ---: | ---: | ---: | --- | --- |',
  ...catalogProducts.map(product => {
    const instagram = product.media.filter(media => media.mediaType === 'Instagram reel').length;
    const youtube = product.media.length - instagram;
    const evidence = product.media.length ? product.media.map(media => media.id).join(', ') : product.sourceNote;
    const stills = product.photos.length ? String(product.photos.length) : product.media.some(media => media.image) ? '1+' : '0';
    return `| [${product.name}](../src/data/catalogue.js) | ${product.category} | ${evidence} | ${stills} | ${instagram} | ${youtube} | ${product.applications.join(', ')} | Current material, dimensions, colour, price and availability |`;
  }),
  '',
  '## Media links by product',
  '',
  ...catalogProducts.flatMap(product => [
    `### ${product.name}`,
    '',
    ...product.photos.map(photo => `- [${photo.id}](${photo.source}) — original ${photo.platform} product photograph: ${photo.title}`),
    ...(product.media.length ? product.media.map(media => `- [${media.id}](${media.source}) — ${media.mediaType}: ${media.title?.replace(/\s+/g, ' ').slice(0, 120) || 'Untitled'}`) : product.photos.length ? [] : [`- ${product.sourceNote}; no dedicated saved video or photograph.`]),
    '',
  ]),
  '## Media requiring manual identification',
  '',
  ...catalogMedia.filter(media => !media.productSlug).map(media => `- [${media.id}](${media.source}): no caption or title sufficient to identify the product.`),
  '',
  '## Evidence boundaries',
  '',
  '- Named watch brands in archive captions identify a photographed watch; they do not imply brand partnership or guaranteed fit.',
  '- Descriptive material names in older posts are not current material inventory.',
  '- The official Instagram carousel CzpzicbCo_L documents a vegetable-tanned leather belt in eight photographs; three distinct views are saved locally. The official DKdzpIxC8_s carousel documents watch pouches in three photographs.',
  '- Passport holders and laptop sleeves are listed by the official YouTube channel but have no dedicated images in this saved archive.',
  '- The 2013 Toyota Land Cruiser smart-key item and women’s bags are user-supplied references. Their original YellowCada posts, specifications and photographs remain unverified.',
  '- Gallery stills come from videos and are not additional independent product photographs.',
];
await writeFile(new URL('../research/product-inventory.md', import.meta.url), lines.join('\n')+'\n', 'utf8');
console.log(`Wrote research/product-inventory.md with ${catalogStats.products} product types and ${catalogStats.associatedMedia} associated media records.`);
