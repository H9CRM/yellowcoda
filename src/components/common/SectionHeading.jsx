export default function SectionHeading({ eyebrow, title, copy, centered = false, titleId }) {
  return <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <span className="eyebrow inline-block text-xs font-bold uppercase tracking-[.18em] leading-normal text-gold-deep">{eyebrow}</span>}
    <h2 id={titleId} className="my-4 font-serif text-[clamp(2.25rem,4.5vw,4.3rem)] leading-[1.08] tracking-tight text-ink">{title}</h2>
    {copy && <p className="max-w-xl text-base leading-relaxed text-muted">{copy}</p>}
  </div>;
}
