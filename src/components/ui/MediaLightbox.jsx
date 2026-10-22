import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import useModalFocus from '../../hooks/useModalFocus';
import YouTubePlayer from './YouTubePlayer';

export default function MediaLightbox({ media, product, onClose }) {
  const ref = useRef(null);
  useModalFocus(Boolean(media), ref, onClose);
  if (!media) return null;
  const youtube = media.mediaType === 'YouTube video';
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/85 p-3 motion-safe:animate-[overlay-in_220ms_ease-out_both]" onClick={onClose}><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="media-lightbox-title" className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto bg-paper p-4 motion-safe:animate-[dialog-in_260ms_ease-out_both] sm:p-6" onClick={event => event.stopPropagation()}><div className="mb-4 flex items-start justify-between gap-4"><div><p className="mb-1 text-xs uppercase tracking-widest text-gold-deep">{media.mediaType} · archive</p><h2 id="media-lightbox-title" className="mb-0 text-2xl">{media.title?.split('#')[0]?.trim() || product.name}</h2></div><button type="button" className="grid size-11 min-w-11 place-items-center rounded-full border border-stone-300" onClick={onClose} aria-label="Close video"><X size={19}/></button></div><div className="overflow-hidden bg-ink">{youtube ? <YouTubePlayer item={{ ...media, poster:media.image }}/> : <video controls playsInline preload="metadata" poster={media.image} className="mx-auto max-h-[70dvh] w-full"><source src={media.video} type="video/mp4"/>Your browser does not support video.</video>}</div><div className="mt-4 flex flex-wrap items-center gap-4 text-xs"><Link to={`/products/${product.slug}`} onClick={onClose} className="font-semibold underline underline-offset-4">View {product.name}</Link><Link to={`/gallery/videos/${media.id}`} onClick={onClose} className="underline underline-offset-4">Video details</Link><a href={media.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">Original post</a></div></div></div>;
}
