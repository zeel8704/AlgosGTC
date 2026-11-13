import { PLAIN_TERMS } from '@/content/explain';
import { Landmark, Cpu, Smartphone } from 'lucide-react';

const ICONS = [Landmark, Cpu, Smartphone];

export function PlainTerms() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
      {PLAIN_TERMS.map((t, i) => {
        const Icon = ICONS[i];
        return (
          <div key={t.title} className="card p-7 sm:p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-gold-deep">
              <Icon size={20} strokeWidth={1.6} />
            </span>
            <h3 className="mt-6 font-display text-2xl text-ink">{t.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t.body}</p>
          </div>
        );
      })}
    </div>
  );
}
