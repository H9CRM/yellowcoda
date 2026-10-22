export const homeFaqs = [
  { question:'What does YellowCada make?', answer:'YellowCada’s public portfolio centres on handmade watch straps. Its official channels also show wallets, card holders and pen cases, and list other leather accessories. The product catalogue groups these documented types; ask the maker which are available for a new enquiry.' },
  { question:'Can I ask for a strap made for my watch?', answer:'Yes. Start with the exact watch reference, measured lug width and wrist circumference. YellowCada can then discuss a suitable strap direction and confirm fit before an order is agreed.' },
  { question:'Which leather and finish options can I discuss?', answer:'The archive shows several leather and finish directions, including vintage, Saffiano and suede examples. A past post is a design reference, not a current materials list. Ask YellowCada to confirm the leather, lining, stitching and hardware available for your piece.' },
  { question:'Are the illustrated colours ready to order?', answer:'No. Cognac, Midnight and Olive drawings on this site are design concepts. They help start a conversation, while the actual colour, material, photograph and price must be confirmed directly.' },
  { question:'What should I send with an enquiry?', answer:'Name the product type and share a link to any archive post that inspired you. For a watch strap, include the watch model, measured lug width and wrist circumference. The contact page lets you provide these details without making a payment.' },
  { question:'How much will a custom piece cost?', answer:'There is no verified public price list for the products shown here. Send the product and design details through the enquiry form so YellowCada can confirm the current specification and quote.' },
  { question:'How long will production and delivery take?', answer:'A fixed turnaround or delivery promise has not been verified for the current catalogue. Ask YellowCada for an estimate after the product, material, fit and destination have been discussed.' },
  { question:'How will delivery be arranged?', answer:'Include your destination in the enquiry. YellowCada can then confirm the available delivery method, shipping charge and expected timing with the product quote. The site does not take payment or promise a courier or delivery region.' },
  { question:'Can I browse real examples before enquiring?', answer:'Yes. The gallery contains original Instagram and Facebook product photos, saved Reels, YouTube videos and their stills from YellowCada’s public channels. Each media page links to its original source and, where identifiable, the related product type.' },
];

export const storyFaqs = [
  { question:'What is known about YellowCada’s background?', answer:'The public Instagram and YouTube channels document YellowCada’s leather work, especially watch straps and small leather goods. A founding date or personal origin story has not been supplied, so this page describes the work shown by the brand instead.' },
  { question:'What leather goods and materials does YellowCada describe?', answer:'Its official YouTube channel description lists wallets, card holders, watch straps, belts, passport holders and laptop sleeves. It says the brand uses Italian leather and accepts custom requirements. The material and configuration of any particular new piece still need direct confirmation.' },
  { question:'How does a custom strap enquiry begin?', answer:'Share the watch reference, measured lug width, wrist circumference and a material or style reference. YellowCada can then confirm whether the requested construction, fit and finish are suitable and provide current availability and pricing.' },
  { question:'Can I use an archive piece as inspiration?', answer:'Yes. A saved Reel or video is a useful reference for silhouette, colour or finish. The specific material, dimensions and design must be discussed for a new piece; a past post does not establish that an identical item can be supplied.' },
  { question:'Which small leather goods appear in the archive?', answer:'Official posts show wallets, card holders and pen cases. The YouTube channel also lists belts, passport holders and laptop sleeves. Product pages distinguish photographed examples from types mentioned by the brand without a saved product image.' },
  { question:'What happens after I submit a request?', answer:'The enquiry provides YellowCada with your product, watch or design details for a direct conversation. It does not place a paid order. Final fit, materials, availability, price and timing are confirmed with the maker.' },
];

export const galleryFaqs = [
  { question:'What are the images and videos in this gallery?', answer:'The library uses original product photos, saved Reel stills and videos from YellowCada’s public Instagram, Facebook and YouTube channels. Three clearly marked campaign posters were created as illustrative concepts for this website; they are not client projects or product photographs.' },
  { question:'Can I request something inspired by a gallery item?', answer:'Yes. Open the item, follow its related product link and include the original media link in your enquiry. The maker must confirm present materials, fit, configuration and price before a new piece can be agreed.' },
  { question:'Can an earlier design be reproduced exactly?', answer:'An archive item is a reference, not a promise of identical production. Current material and hardware availability may differ, and another person’s protected or custom design should not be copied without permission. Discuss an appropriate new direction with YellowCada.' },
  { question:'Are colours and sizes shown in old posts available now?', answer:'The saved media records past work only. Current colour, material and size options have not been verified for every item. Send your watch measurements or product requirements so the maker can check the actual options.' },
  { question:'Where can I see the original post?', answer:'Each library item links to its original Instagram Reel or YouTube video, and its detail page gives more context. The gallery also connects identified archive items to the relevant product type.' },
];

const typeQuestions = {
  'rally-straps':'What defines the rally strap style?',
  'integrated-straps':'Why does an integrated strap need a fit check?',
  'bund-straps':'What is the leather backing on a Bund strap?',
  'nato-straps':'What makes this a NATO-style strap?',
  'apple-watch-straps':'What Apple Watch details should I share?',
  'leather-wallets':'What wallet styles are documented?',
  'card-holders':'What card holder examples are documented?',
  'pen-cases':'What does the archived pen case hold?',
  'watch-pouches':'Are these YellowCada watch pouches photographed?',
  'leather-belts':'Which YellowCada leather belt is photographed?',
  'passport-holders':'Are passport holder dimensions available?',
  'laptop-sleeves':'Are device sizes confirmed for these sleeves?',
  'stitched-watch-straps':'Which stitched strap styles appear in the archive?',
  'vegetable-tan-belt':'What is known about the vegetable-tan belt?',
  'land-cruiser-smart-key-accessory':'Is the Land Cruiser smart-key accessory verified?',
  'womens-bags':'Which women’s bag styles are available?',
};

export function productFaqs(product) {
  const name = product.name.toLowerCase();
  const watchStrap = product.category === 'Watch straps';
  const specificAnswers = {
    'watch-pouches':'Yes. An official three-image YellowCada Instagram carousel shows leather watch pouches in tan and muted green. The photos document previous work; the dimensions, lining and current material choices still need confirmation.',
    'leather-belts':'YellowCada’s official Instagram carousel photographs a vegetable-tanned belt with a brass-coloured buckle. No size chart or current belt specification is given in the post; share your measurements when enquiring.',
    'vegetable-tan-belt':'The original YellowCada caption names a “Top Notch vegetable tan belt,” and its carousel provides multiple photographs. The post does not specify a current price, length, width or delivery date.',
  };
  const specific = product.slug === 'watch-straps'
    ? { question:'What kinds of watch straps appear in the YellowCada archive?', answer:'The official posts show handmade straps in several profiles and leather directions, including rally, integrated and Bund examples. These are documented examples. Use the linked media to choose a direction, then ask what can be made for your watch now.' }
    : { question:typeQuestions[product.slug] || `What is documented about ${name}?`, answer:specificAnswers[product.slug] || product.description };
  return [specific,
    { question:watchStrap ? `How do I check whether ${name} will fit my watch?` : `What options can I ask about for ${name}?`, answer:watchStrap ? 'Provide the exact watch reference, measured lug width and wrist circumference. The maker can then review the construction shown here and confirm the specific fit and available details before an order.' : `The archive records the product type, but it is not a live stock or options list. Share the example that interests you and ask YellowCada to confirm current material, dimensions, configuration and price for ${name}.` },
    { question:product.verification === 'reference-to-confirm' ? `Is ${name} available to order now?` : `Can I order the exact ${name} shown in the archive?`, answer:product.verification === 'reference-to-confirm' ? 'The original social-media post and current availability have not yet been verified. Share the post with YellowCada so the exact item and a current quote can be confirmed.' : 'Past imagery is a reference for a new enquiry. An identical material, colour or specification may not be available now; YellowCada confirms what can be made before any order is agreed.' },
    { question:`How do I request a quote for ${name}?`, answer:`Use the contact form and name ${product.name}. Include the link to a relevant archive post and any measurements or design requirements. YellowCada can then confirm the specification, price and expected timing directly.` },
    { question:`How is delivery arranged for ${name}?`, answer:'Start with an enquiry and provide your delivery destination. Ask YellowCada to confirm production timing, available delivery method, shipping charge and any tracking details with the quote. The website does not take payment or promise a delivery date.' },
  ];
}
