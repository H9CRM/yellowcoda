export default function OptimizedImage({ src, alt, width = 800, height = 800, priority = false, className = '' }) {
  return <img src={src} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async" className={className} />;
}
