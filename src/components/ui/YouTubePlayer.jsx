import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

export default function YouTubePlayer({ item }) {
  const [playing, setPlaying] = useState(false);
  return <div className={`youtube-player relative w-full ${item.kind === 'short' ? 'youtube-player-short w-full max-w-[430px]' : ''}`}>
    {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1`} title={`${item.displayTitle} on the Yellow Cada YouTube channel`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> : <button type="button" onClick={() => setPlaying(true)} className="youtube-poster relative block w-full border-0 bg-ink p-0" aria-label={`Play ${item.displayTitle} on this page`}><img src={item.thumbnail} alt={`${item.displayTitle}, official Yellow Cada YouTube thumbnail`} width="720" height="405"/><span><Play size={20} fill="currentColor"/> Play video</span></button>}
    <a href={item.source} target="_blank" rel="noreferrer" className="youtube-external absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 bg-paper px-3 py-2 text-xs font-bold text-ink">Watch on YouTube <ArrowUpRight size={15}/></a>
  </div>;
}
