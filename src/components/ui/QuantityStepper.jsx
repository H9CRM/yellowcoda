import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ productName, value, onChange }) {
  return <div role="group" aria-label={`${productName} quantity`} className="inline-flex max-w-full items-center border border-stone-300 bg-paper">
    <button type="button" className="grid size-11 shrink-0 place-items-center transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-transparent" aria-label={`Decrease ${productName} quantity`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={15}/></button>
    <output aria-live="polite" className="min-w-7 px-1 text-center text-sm font-semibold tabular-nums">{value}</output>
    <button type="button" className="grid size-11 shrink-0 place-items-center transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-transparent" aria-label={`Increase ${productName} quantity`} disabled={value >= 10} onClick={() => onChange(value + 1)}><Plus size={15}/></button>
  </div>;
}
