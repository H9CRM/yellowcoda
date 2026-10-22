# YellowCada Vite storefront

Vite, React and Tailwind storefront for YellowCada. Every public route is prerendered into readable HTML with headings, descriptions, internal links, FAQs, canonical metadata and JSON-LD. The adjacent `sample-website/` folder remains untouched.

## Local start

Requires Node.js 22.16+.

```powershell
cd D:\WORK\watch-website\yellowcada-vite\yellowcoda
Copy-Item .env.example .env
npm install
npm run build
npm start
```

Open <http://localhost:3000/>. For live editing, run `npm run dev:api` and `npm run dev` in separate terminals. The Vite process proxies API requests to the Node server.

## Product discovery

- The homepage hero presents two separate watch strap halves, without a watch, and links directly to the watch strap collection. Its generated product visual is labelled an illustrative direction. A home strap studio previews leather colour, stitching and buckle finish; selected directions are carried into the enquiry bag and enquiry form for discussion, subject to maker confirmation.
- `/products` contains 17 product types and references across watch straps, small leather goods, accessories and bags. It includes category filters, comparison controls in the image corner, direct View links and Add to cart buttons. Unpictured references use compact enquiry cards instead of empty image blocks.
- The compact navbar search suggests products, guides, original photos, gallery stills, videos, FAQs and key pages. Results support type filters, ranked suggestions and common one-letter misspellings.
- The catalogue source is `src/data/catalogue.js`. It groups 56 saved Instagram Reels and 23 YouTube videos under product types using the archived caption, title or saved poster. The uncaptioned reel is mapped only to the product type visible in its poster.
- Each product type has a prerendered `/products/:slug` page with official archive media where available, related products, product-specific measurement prompts, an enquiry and delivery explainer, FAQs and an enquiry path.
- The handmade watch strap detail page has three interactive **illustrative** colour directions (Cognac, Midnight and Olive). They are not approved orderable variants.
- View opens the product page. Add to cart opens the off-canvas enquiry bag, where all selected items can be reviewed before sending one enquiry. The heart on product detail pages saves a product; the favourites panel can add one or all saved products to the bag. Comparison holds up to four products. Reels are represented by light posters and loaded only when selected.
- Wallets, card holders, stitched straps, the vegetable-tan belt and watch pouches are supported by saved official media. The belt page uses three distinct views from the original eight-image carousel; the pouch page uses all three images from its original carousel. The Land Cruiser smart-key item and women’s bags remain **Reference to confirm** until an original post is supplied.
- `research/product-inventory.md` lists every media association and the evidence limits. Regenerate with `npm run audit:catalogue`.

The catalogue is **enquiry only**. The Node/SQLite API accepts catalogue products in the enquiry bag and checkout, including optional watch fit notes for straps. Prices, stock, current leather supply, delivery regions, precise dimensions and current business contact details were not supplied and are not asserted. Product pages ask for a delivery destination and explain which shipping terms must be confirmed directly. The older sample enquiry bag and admin catalogue remain for compatibility.

## Media and content

The site includes 56 locally saved Instagram videos and their posters, 23 locally saved official YouTube thumbnails, 14 original Instagram and Facebook product photographs, 93 archive image pages, six work notes, three campaign poster studies in three formats, and six detailed guides. Original social URLs and captions are preserved in `research/` and `src/data/officialPhotos.js`. The supplied logo is `public/images/yellowcada-official-logo.jpg`.

`/gallery` is a searchable media library with separate Images (14 product photos, 79 official video stills and three labelled poster concepts) and Videos (56 Reels plus 23 YouTube items) tabs. Product-category filters are derived from media with actual matches. Search, tab and category state are shareable through `type`, `q` and `category` URL parameters. The first 24 results render immediately; more load on request. Image lightboxes support keyboard arrows, touch swipe and product links. Video players mount only after selection.

`/about` is the combined Story & Craft page, with archive evidence, the brand's attributed YouTube description and an enquiry path. The Node storefront permanently redirects old `/services` to `/about#craft` and `/compare` to `/products`. Product comparison remains inside the catalogue tray and dialog; neither old URL is generated as a standalone page or listed in the sitemaps.

## SEO and launch

`npm run build` runs the client build, SSR bundle, prerenderer and SEO generators. `npm run check:html` verifies actual source HTML, metadata, schemas, image alt text, local image assets and internal links on every generated route. Generated files include `robots.txt`, `sitemap.xml`, `sitemap-index.xml`, `image-sitemap.xml`, `llms.txt` and `humans.txt`.

The local environment uses `http://localhost:3000` in canonical URLs and emits `noindex`. Before publishing, set `VITE_SITE_URL` and `APP_URL` to the verified HTTPS production domain, approve contact and policy information, and rebuild. No domain, seller address, WhatsApp number, payment method or shipping coverage has been guessed.

## Quality checks

```powershell
npm run lint
npm run audit:catalogue
npm run build
npm run check:html
npm run smoke:enquiry
```

The existing Node server serves the prerendered `dist/` files and `/api/*` from one origin. Deploy with a persistent private `data/` directory; run `npm ci && npm run build && npm start`. The archived videos make the build large, so a production host may need owned object storage for them.

## GitHub Pages deployment

The Pages destination for this repository is `https://h9crm.github.io/yellowcoda/`. The `Deploy YellowCada to GitHub Pages` workflow builds on pushes to `main`, using Node 24 and the committed npm lockfile. Repository Settings → Pages → Source must be **GitHub Actions**. It uploads only `dist/`, after lint and HTML verification pass.

The workflow obtains the deployment URL from GitHub Pages and sets `VITE_SITE_URL` and `VITE_STATIC_HOSTING=true`. Vite assets, router basename, native links, images, video posters, manifest, canonicals, schemas and sitemaps all use the same project path. Every public route has a generated directory index; `404.html` contains a real error page. `/services`, `/compare` and `/search` have static redirects. Page metadata is managed by Helmet during both rendering and hydration.

Pages hosts the static catalogue, browser enquiry bag, saved products, comparison and media. It cannot run the included Node/SQLite API or admin dashboard. In this deployment, contact and checkout prepare a message visitors can copy and send through the linked official Instagram or Facebook account. Tracking directs visitors to the same channels. The website does not submit or record those enquiries. The Node-backed forms remain available when building without `VITE_STATIC_HOSTING=true` for a Node host.

Reproduce the Pages build locally:

```powershell
$env:VITE_SITE_URL='https://h9crm.github.io/yellowcoda'
$env:VITE_STATIC_HOSTING='true'
npm ci
npm run lint
npm run build
npm run check:html
npm run preview
```

Open `http://localhost:4173/yellowcoda/`. The checker validates 215 rendered routes, metadata, JSON-LD, image alt attributes, local targets, deployment URLs, manifests and sitemap targets. GitHub Pages project-level `robots.txt` is provided at `/yellowcoda/robots.txt`; crawler policy for the account host is controlled by its root `/robots.txt`. The sitemap and `llms.txt` remain available under the project path. These discovery files help describe the site; inclusion in search or AI answers is not guaranteed.
