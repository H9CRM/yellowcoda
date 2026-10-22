import { faqs } from '../../data/faqs';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function FAQ({ entries = faqs.slice(0, 4) }) {
  return <section className="py-16 md:py-24 xl:py-28" id="faqs">
    <div className="mx-auto grid w-full max-w-7xl gap-9 px-4 sm:px-7 md:grid-cols-[.85fr_1.15fr] md:gap-16 md:px-10">
      <Reveal><SectionHeading eyebrow="Considered answers" title="Good questions. Clear answers." copy="Useful details before you send an enquiry." /></Reveal>
      <div className="divide-y divide-stone-300 border-t border-stone-300">
        {entries.map(({ question, answer }, index) => <Reveal key={question} delay={index % 4}>
          <details className="group">
            <summary className="min-h-16 cursor-pointer list-none py-5 marker:hidden [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 flex items-center justify-between gap-4 font-sans text-base font-semibold">{question}<span aria-hidden="true" className="text-2xl font-light text-gold-deep"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span></h3>
            </summary>
            <p className="max-w-2xl pr-5 pb-6 text-sm leading-relaxed text-muted motion-safe:group-open:animate-[faq-in_260ms_ease-out_both]">{answer}</p>
          </details>
        </Reveal>)}
      </div>
    </div>
  </section>;
}
