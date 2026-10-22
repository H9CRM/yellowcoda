// Links and captions were collected from YellowCada's public Instagram reels.
// The local video files are downloaded into /public/videos by reel-urls.txt.
export const featuredReels = [
  { id: 'Dda_Wofouan', title: 'JLC leather strap', caption: 'Jlc leatherstrap #customwatchstrap #jlcreverso #ycstraps #yellowcadastraps #dubaiwatchclub' },
  { id: 'Dc4CPxdB9GZ', title: 'Custom watch strap', caption: 'Custom watch strap #ycstraps #customwatchstrap #luxurywatchstraps' },
  { id: 'DckXiAiI_dW', title: 'Vintage cognac', caption: 'Vintage cognac #ycstraps #customwatchstrap #luxurywatchstraps' },
  { id: 'DbYagdjooG-', title: 'Handmade leather straps', caption: 'Premium handmade leather straps #ycstraps #customwatchstraps' }
].map(reel => ({ ...reel, video: `/videos/${reel.id}.mp4`, poster: `/videos/${reel.id}.jpg`, source: `https://www.instagram.com/reel/${reel.id}/` }));
