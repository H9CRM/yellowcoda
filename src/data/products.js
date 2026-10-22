// These are design concepts from the supplied sample, not verified, priced SKUs.
export const products = [
  { id: 1, slug: 'cognac-classic', name: 'The Cognac', tone: 'Cognac', style: 'Classic', subtitle: 'Warm tone. Quiet character.', image: '/images/cognac.svg', color: '#a75b31', featured: true },
  { id: 2, slug: 'midnight-dress', name: 'The Midnight', tone: 'Black', style: 'Dress', subtitle: 'An understated everyday companion.', image: '/images/midnight.svg', color: '#292825', featured: true },
  { id: 3, slug: 'olive-field', name: 'The Field', tone: 'Olive', style: 'Casual', subtitle: 'A different direction, in olive.', image: '/images/olive.svg', color: '#62664a', featured: true },
  { id: 4, slug: 'espresso-classic', name: 'The Espresso', tone: 'Brown', style: 'Classic', subtitle: 'Depth, texture and a dark finish.', image: '/images/espresso.svg', color: '#503428', featured: true },
  { id: 5, slug: 'navy-dress', name: 'The Atlantic', tone: 'Navy', style: 'Dress', subtitle: 'Deep navy. A considered contrast.', image: '/images/navy.svg', color: '#2f4958' },
  { id: 6, slug: 'burgundy-classic', name: 'The Merlot', tone: 'Burgundy', style: 'Classic', subtitle: 'Rich colour, without the noise.', image: '/images/burgundy.svg', color: '#723e43' }
].map(product => ({ ...product, description: `${product.subtitle} This illustrative leather watch strap direction can be discussed with YellowCada for material, dimensions and price before an order is accepted.`, category: 'Watch straps', price: null, concept: true }));

export const categories = ['All designs', 'Classic', 'Dress', 'Casual'];
