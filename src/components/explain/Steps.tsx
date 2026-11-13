import { STEPS } from '@/content/explain';

interface StepsProps {
  /** `row` lays the steps out across the page; `list` stacks them with longer text. */
  layout?: 'row' | 'list';
}

export function Steps({ layout = 'row' }: StepsProps) {
  if (layout === 'list') {
    return (
      <ol className="border-t border-line">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-4 border-b border-line py-7">
            <span className="font-display italic text-3xl sm:text-4xl leading-none text-gold">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-display text-2xl text-ink">{s.title}</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative lg:pr-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold text-sm font-semibold tnum text-gold-deep">
              {i + 1}
            </span>
            <span className="hidden lg:block h-px flex-1 bg-line" aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-display text-[22px] leading-tight text-ink">{s.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
