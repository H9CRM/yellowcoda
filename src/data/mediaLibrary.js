import archive from '../../research/instagram-reels.json' with { type: 'json' };
import youtubeArchive from '../../research/youtube-videos.json' with { type: 'json' };
import { workNotes } from './portfolioData.js';
import { officialPhotos } from './officialPhotos.js';

export const reels = archive.map(item => {
  const caption = item.caption.trim();
  const lower = caption.toLowerCase();
  const category = !caption ? 'Uncaptioned reels' : /pen case|wallet|card.?holder|cardwallet/.test(lower) ? 'Small leather goods' : /rally/.test(lower) ? 'Rally straps' : /vintage|distressed|antique/.test(lower) ? 'Vintage straps' : 'Watch straps';
  const firstLine = caption.split('\n')[0].replace(/#\S+/g, '').trim();
  return {
    ...item,
    category,
    displayTitle: firstLine ? firstLine.slice(0, 72) : 'YellowCada reel',
    date: item.posted ? `${item.posted.slice(0,4)}-${item.posted.slice(4,6)}-${item.posted.slice(6,8)}` : null
  };
});

export const portfolio = workNotes.map(([id, title, summary]) => ({ ...reels.find(reel => reel.id === id), id, title, summary }));

export const youtubeVideos = youtubeArchive.map(item => ({
  ...item,
  category: /wallet|card holder|holder|belt|passport|sleeve/i.test(item.title) ? 'Small leather goods' : 'Watch straps',
  displayTitle: item.title.replace(/\s*#.*$/, '').trim() || item.title,
  poster: item.thumbnail,
  platform: 'YouTube',
}));

export const videos = [
  ...reels.map(item => ({ ...item, platform: 'Instagram' })),
  ...youtubeVideos,
];

// The still gallery uses original Reel posters and saved official YouTube thumbnails.
// Each image links to its source video; it does not claim to be a separate product photo.
export const galleryImages = [
  ...officialPhotos.map(item => ({ ...item, id:`post-${item.id}` })),
  ...reels.map(item => ({
    id: `instagram-${item.id}`,
    title: item.displayTitle,
    image: item.poster,
    alt: `${item.displayTitle} — still from a YellowCada Instagram reel`,
    caption: item.caption,
    platform: 'Instagram',
    category: item.category,
    source: item.source,
    videoId: item.id,
  })),
  ...youtubeVideos.map(item => ({
    id: `youtube-${item.id}`,
    title: item.displayTitle,
    image: item.thumbnail,
    alt: `${item.displayTitle} — thumbnail from the Yellow Cada YouTube channel`,
    caption: item.title,
    platform: 'YouTube',
    category: item.category,
    source: item.source,
    videoId: item.id,
  })),
];
