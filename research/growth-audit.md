# YellowCada website growth audit — 3 October 2026

This is a working implementation brief for the local YellowCada Vite site. The source material is the supplied `sample-website`, the official [@yellowcada Instagram](https://www.instagram.com/yellowcada/) archive saved in `instagram-reels.json`, and publicly visible competitor pages. The owner has confirmed that the storefront should remain **enquiry-only**. Business address, official domain, current product catalogue, prices and policies remain unverified. Search volume, keyword difficulty, rankings, traffic, backlinks, AI citations and Core Web Vitals field data are **N/A** without connected measurement tools or a live domain.

## Existing-site autopsy

| Decision | Finding | Action |
| --- | --- | --- |
| Keep | Build-time prerendering produced readable HTML, unique metadata, canonical links, JSON-LD, FAQs and image references on every route. | Preserve SSG and check source HTML after each build. |
| Keep | Premium dark/cream/gold visual system, persistent enquiry bag, search, filtering, quick view and saved concepts work. | Extend the same components and design language. |
| Keep | Existing Node/SQLite API and private administration operate locally. | Retain routes and API validation. |
| Improve | The shop had no comparison path; product concepts were hard to evaluate together. | Add selection controls, a comparison tray and `/compare`. |
| Improve | Only four of 56 archived reels were visible. | Add filterable `/gallery` and six source-linked work notes under `/portfolio`. |
| Improve | No useful knowledge hub or measurement path. | Add three fit/construction guides and connect them to craft, comparison and contact pages. |
| Improve | Checkout sent unchosen default taper, lining, thread and thickness as if the customer selected them. | Accept neutral enquiry notes and only the measurements entered by the visitor. |
| Improve | The backend's acknowledgement linked to `/track-order`, which the React site did not provide. | Add a private reference/access-code tracking page. |
| Add | Public forms lacked a clear disclosure of stored enquiry data. | Add a preview data notice, pending owner-approved legal policy. |
| Add | The site had no original campaign poster library. | Generate three original SVG concepts in square, portrait and story sizes. |
| Technical fix | A stale Tailwind 3 development overlay appeared after upgrading to Tailwind 4. | Use `@tailwindcss/postcss` with `@import "tailwindcss"`; restart and verify the live Vite CSS response. |
| Technical fix | Illustrative product concepts and short archival work notes were eligible for future indexing. | Mark those detail pages `noindex,follow` and omit them from the XML sitemap until approved content exists. |
| Defer | Real payment, current stock, verified product photos, legal seller details, delivery coverage, WhatsApp/phone CTAs and local landing pages lack approved data. | Keep enquiry-only; request brand facts before public launch. |

The supplied sample's `server/content.mjs` contains sizing and construction guidance. The new React guides adapt the practical concepts without inventing workshop history, clients or results. No Google Business Profile, Search Console, analytics or backlink export was provided.

## Competitor evidence and resulting opportunities

These are public page observations, **not** measured rankings or traffic estimates. Local geography is a research hypothesis from historic Instagram captions mentioning Pakistan, not a verified current business address or delivery area.

| Competitor and page | Observed strength | YellowCada opportunity implemented or queued |
| --- | --- | --- |
| [Leather-Man Pakistan](https://leathermanpk.com/) | Named strap categories, quick view, visible prices and lead-time information. | Retain quick view, add comparison; display prices and timing only after approval. |
| [Jild](https://www.jild.pk/products/standard-22mm-handmade-leather-watch-strap-1) | Product page gives width, variant, inclusions and customer review context. | Add verified product-level specs and real customer evidence when supplied. |
| [Waji's](https://www.shopwajis.com/collections/accessories-watch-straps) | Collection groups suede and vegetable-tanned strap options by material/colour. | Give style and material discovery paths without pretending the concept cards are in stock. |
| [Casio Centre Pakistan](https://ecasiocentre.pk/collections/leather-straps) | Collection uses availability, price filters, quick buy and compare. | Add concept comparison and preserve enquiry rather than a false purchase path. |
| [Blackbird Leathers](https://blackbirdleathers.com/buy-leather-watch-straps-in-pakistan/) | Dedicated search landing page addresses customised leather straps in Pakistan. | Build a focused custom strap craft page; defer location claims until verified. |
| [Noiré Leathers Dubai](https://www.noireleathers.com/bespoke) | Bespoke page explains material choices and a three-step process with a starting price. | Explain YellowCada's fit/material/finish/confirmation process; quote individually. |
| [OPTO WATCH CO.](https://optowatchco.com/pages/our-profile) | About page clearly states audience, location and ready-to-ship model. | Ask owner for verified business identity and service area before entity/local schema. |
| [Delugs](https://delugs.com/pages/our-customisation-options) | Detailed customisation and sizing guidance explains lug/buckle width, length and finish. | Add sizing, taper and construction guides; use only supplied YellowCada options. |
| [Atelier Taha](https://ateliertaha.com/) | Premium editorial layout ties a bespoke process to a watch-first choice. | Use a watch-first editorial flow and measured visual hierarchy. |
| [Thomas Artisan Straps](https://www.thomasartisanstraps.com/) | Strong collection imagery, series navigation and a sizing guide. | Add selected work, a reel gallery and practical guides with direct internal links. |
| [Jean Rousseau](https://www.jean-rousseau.com/us/workshop/ahmed-seddiqi-sons-mall-of-the-emirates/) | Local atelier page gives real store details and bespoke measurements. | Do not create a YellowCada location page or LocalBusiness claim without a verified address. |

## Keyword-to-page map

All terms below are **research candidates**, not measured demand. Volume and difficulty are N/A. Each cluster has one intended primary URL to limit cannibalisation.

| Intent cluster | Primary phrase | Related questions/terms | Destination | Next action |
| --- | --- | --- | --- | --- |
| Transactional/commercial | handmade leather watch straps | custom watch straps, made-to-order strap | `/` | Explain brand and route to shop/craft. |
| Commercial | leather watch strap designs | cognac, black, olive, dress, casual | `/shop` | Filter design concepts and send enquiry. |
| Commercial | custom leather watch strap | leather, lining, stitching, watch fit | `/services` | Explain the process and request a fit discussion. |
| Comparison | compare leather watch strap styles | dress vs casual, colour directions | `/compare` | Compare visual directions without unverified specifications. |
| Informational | how to measure watch strap lug width | wrist circumference, watch reference | `/guides/how-to-measure-watch-strap` | Guide to a better fit enquiry. |
| Informational | padded vs unpadded watch strap | thin vs padded profile | `/guides/padded-vs-unpadded-straps` | Link to craft and compare. |
| Informational | what does 20/16 watch strap mean | lug width, buckle width, taper | `/guides/understanding-watch-strap-taper` | Answer directly and link to fit guide. |
| Commercial investigation | handmade watch strap examples | rally, vintage, saffiano | `/portfolio` | Source-linked examples; no fabricated case outcomes. |
| Visual discovery | leather watch strap videos | leathercraft reels, small leather goods | `/gallery` | Local posters and original Instagram links. |
| Navigational/help | YellowCada strap FAQ | cost, timing, sizing, materials | `/faq` | Direct answers and enquiry CTA. |
| Navigational/conversion | YellowCada contact | custom strap enquiry | `/contact` | Stored message with clear no-payment wording. |

No "best near me" or city pages were created: actual business location and service area are unconfirmed. No traffic, authority, review, ranking or AI-answer share metric is claimed.

## Funnel and evidence boundaries

Awareness: source-readable home, guides, gallery and portfolio. Discovery: shop, craft and visual archive. Consideration: compare, FAQs and fit guidance. Conversion: saved concepts, enquiry bag, contact form. Follow-up: private reference tracking and admin review. Current analytics and email delivery require owner configuration; no third-party tracking pixel was added.

Before launch, replace illustrative concepts with approved product data; confirm owner identity/domain/contact/policies; decide retention and transactional mail; then run source, schema, mobile, accessibility and field-performance checks on the real HTTPS domain. Actual Google/Bing rankings and AI citations must be measured after launch.
