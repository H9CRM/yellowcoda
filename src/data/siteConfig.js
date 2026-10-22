export const siteConfig = {
  name: 'YellowCada',
  staticHosting: import.meta.env.VITE_STATIC_HOSTING === 'true',
  tagline: 'Handcrafted around your watch.',
  url: (import.meta.env.VITE_SITE_URL || 'http://localhost:4173').replace(/\/$/, ''),
  instagram: 'https://www.instagram.com/yellowcada/',
  facebook: 'https://www.facebook.com/p/Yellow-Cada-100064100522757/',
  youtube: 'https://www.youtube.com/@Ycstraps',
  websiteCreator: { name: 'Tralionex', url: 'https://tralionex.pk/' },
  logo: '/images/yellowcada-official-logo.jpg',
  description: 'Explore YellowCada handmade leather watch straps, considered materials and made-to-order design directions. Enquire about a strap made for your watch and wrist.',
  ogImage: '/og-image.jpg',
  launchReady: Boolean(import.meta.env.VITE_SITE_URL && !/localhost|\.example/.test(import.meta.env.VITE_SITE_URL))
};
