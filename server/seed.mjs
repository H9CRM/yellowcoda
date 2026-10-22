// These are proposed catalogue concepts, not verified existing YellowCada SKUs.
// All start unpriced, unapproved and illustration-only. Real checkout is blocked.
const shared = {
  leather: 'Full-grain leather', origin: 'Confirm at product level', thicknesses: [2,3,4],
  paddings: ['Unpadded','Padded'], linings: ['Zermatt leather','Vegetable-tanned leather'],
  threads: ['0.45 mm','0.50 mm'], tapers: ['20/16'], quickRelease: true,
  buckle: '316 stainless steel', wristMin: 127, wristMax: 203.2,
  production: '1–3 working days', additions: {padded:0, zermatt:0, quickRelease:0},
  restricted: false, imageApproved: false, materialsApproved: false,
};
export const seedProducts = [
  {slug:'cognac-classic', name:'The Cognac', subtitle:'Warm tone. Quiet character.', colour:'Cognac', hex:'#915028', style:'Classic', image:'cognac.svg'},
  {slug:'midnight-dress', name:'The Midnight', subtitle:'An understated everyday companion.', colour:'Black', hex:'#292825', style:'Dress', image:'midnight.svg'},
  {slug:'olive-field', name:'The Field', subtitle:'A different direction, in olive.', colour:'Olive', hex:'#62664a', style:'Casual', image:'olive.svg'},
  {slug:'espresso-classic', name:'The Espresso', subtitle:'Depth, texture and a dark finish.', colour:'Brown', hex:'#503428', style:'Classic', image:'espresso.svg'},
  {slug:'navy-dress', name:'The Atlantic', subtitle:'Deep navy. A considered contrast.', colour:'Navy', hex:'#2f4958', style:'Dress', image:'navy.svg'},
  {slug:'burgundy-classic', name:'The Merlot', subtitle:'Rich colour, without the noise.', colour:'Burgundy', hex:'#723e43', style:'Classic', image:'burgundy.svg'},
].map((p,i) => ({...p, id:i+1, sku:`YC-CONCEPT-${String(i+1).padStart(3,'0')}`, description:`${p.subtitle} A proposed ${p.colour.toLowerCase()} leather strap configuration. Choose your construction, lining and fit; the selected leather, colour and final price will be confirmed before an order is accepted.`, image:`/assets/${p.image}`, spec:{...shared}, sample:1, approved:0, price_paisa:null, stock:0, active:1}));
export const initialSettings = {
  brand:'YellowCada', tagline:'Handcrafted around your watch.', instagram:'https://www.instagram.com/yellowcada/',
  email:'', whatsapp:'', address:'', legalName:'', salesEnabled:false, launchApproved:false,
  shippingPaisa:null, shippingLabel:'Delivery arrangements confirmed before purchase.',
  taxNote:'', bankInstructions:'', codEnabled:false,
  policiesApproved:false, privacyText:'', termsText:'', returnsText:'', shippingText:'',
  heroHeading:'A new character.\nFor your watch.', heroText:'Full-grain leather. Considered details. A strap made around your watch, your wrist and your style.',
  announcement:'Made around your watch. Sized for your wrist.',
};
