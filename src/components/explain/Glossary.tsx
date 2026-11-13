import { GLOSSARY } from '@/content/explain';
import { COLUMN_METRICS } from '@/lib/metrics';

interface GlossaryProps {
  /** `terms` shows the general vocabulary; `metrics` explains every number on the site. */
  section: 'terms' | 'metrics';
  /** Show only the first N entries. */
  limit?: number;
}

export function Glossary({ section, limit }: GlossaryProps) {
  const entries =
    section === 'terms'
      ? GLOSSARY.map((g) => ({ term: g.term, sub: undefined as string | undefined, body: g.body }))
      : COLUMN_METRICS.map((m) => ({ term: m.label, sub: m.technical, body: m.description }));
  const shown = limit ? entries.slice(0, limit) : entries;

  return (
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-line">
      {shown.map((e) => (
        <div key={e.term} className="border-b border-line py-6">
          <dt className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-xl text-ink">{e.term}</span>
            {e.sub && e.sub !== e.term && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-deep">{e.sub}</span>
            )}
          </dt>
          <dd className="mt-2 text-[15px] leading-relaxed text-ink-2">{e.body}</dd>
        </div>
      ))}
    </dl>
  );
}
