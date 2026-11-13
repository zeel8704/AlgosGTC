import { FAQS } from '@/content/explain';
import { Plus } from 'lucide-react';

interface FaqProps {
  /** Show only the first N questions. */
  limit?: number;
}

export function Faq({ limit }: FaqProps) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <div className="border-t border-ink/70">
      {items.map((faq) => (
        <details key={faq.q} className="group border-b border-line-strong">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left">
            <span className="font-display text-xl sm:text-[22px] text-ink group-hover:text-gold-deep transition-colors">
              {faq.q}
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-2 transition-transform duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-on-dark group-open:border-ink">
              <Plus size={15} />
            </span>
          </summary>
          <p className="pb-7 pr-14 text-[15px] leading-relaxed text-ink-2">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
