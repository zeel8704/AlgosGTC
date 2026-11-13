import { RISKS } from '@/content/explain';
import { AlertTriangle } from 'lucide-react';

interface RisksProps {
  tone?: 'light' | 'dark';
}

export function Risks({ tone = 'dark' }: RisksProps) {
  const dark = tone === 'dark';
  return (
    <ol className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-9 border-t ${dark ? 'border-on-dark/10' : 'border-line'} pt-10`}>
      {RISKS.map((r, i) => (
        <li key={r.title} className="flex gap-4">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-on-dark/10 text-gold-soft' : 'bg-sand text-gold-deep'}`}>
            <AlertTriangle size={16} strokeWidth={1.8} />
          </span>
          <div>
            <h3 className={`font-display text-[22px] leading-tight ${dark ? 'text-on-dark' : 'text-ink'}`}>
              <span className={`mr-2 tnum text-base ${dark ? 'text-gold-soft' : 'text-gold-deep'}`}>{i + 1}.</span>
              {r.title}
            </h3>
            <p className={`mt-2.5 text-[15px] leading-relaxed ${dark ? 'text-on-dark-2' : 'text-ink-2'}`}>{r.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
