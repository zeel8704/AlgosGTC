import Link from 'next/link';
import type { StrategyData } from '@/types';
import { TIER_LABELS } from '@/config/brand';
import { formatInteger, formatPercentUnsigned, formatRatio, formatDateShort } from '@/lib/formatters';
import { Sparkline } from '@/components/charts/Sparkline';
import { ArrowUpRight } from 'lucide-react';

interface StrategyCardProps {
  strategy: StrategyData;
  /** Renders the card on espresso; used for the flagship tier. */
  featured?: boolean;
}

export function StrategyCard({ strategy, featured = false }: StrategyCardProps) {
  const { config, originalMetrics: m } = strategy;
  const tier = TIER_LABELS[config.shortName];
  const dark = featured;

  const surface = dark ? 'bg-espresso border-espresso text-on-dark' : 'bg-ivory border-line text-ink';
  const muted = dark ? 'text-on-dark-2' : 'text-ink-3';
  const body = dark ? 'text-on-dark-2' : 'text-ink-2';
  const rule = dark ? 'border-on-dark/12' : 'border-line';
  const labelCls = `label ${dark ? 'text-on-dark-2' : ''}`;

  const metrics: [string, string][] = [
    ['CAGR', formatPercentUnsigned(m.cagr)],
    ['Max DD', formatPercentUnsigned(m.maxDrawdownPct)],
    ['Profit factor', formatRatio(m.profitFactor)],
  ];

  return (
    <article
      className={`group relative flex flex-col rounded-[6px] border overflow-hidden card-hover ${surface} ${
        dark ? 'shadow-[0_30px_60px_-30px_rgba(43,26,16,0.6)]' : 'shadow-[0_12px_32px_-24px_rgba(58,36,22,0.25)]'
      }`}
    >
      {dark && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-soft to-transparent" />}

      <div className="flex-1 flex flex-col p-7 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className={dark ? 'eyebrow-dark' : 'eyebrow'}>
            Tier {tier?.numeral} · {tier?.label}
          </span>
          <span className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] ${muted}`}>{config.direction}</span>
        </div>

        <h3 className="mt-6 font-display text-[32px] leading-none tracking-[-0.01em]">
          <Link href={`/algos/${config.slug}`} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {config.name}
          </Link>
        </h3>
        <p className={`mt-3 text-sm leading-relaxed ${body}`}>{config.tagline}</p>

        <div className={`mt-7 pt-6 border-t ${rule} flex items-end justify-between gap-5`}>
          <div className="shrink-0">
            <div className={labelCls}>Tested balance</div>
            <div className={`mt-2 font-display text-[46px] leading-[0.9] ${dark ? 'text-gold-soft' : 'text-gold-deep'}`}>
              {config.capitalRequirement.minimumINR}
            </div>
            <div className={`mt-2 text-xs tnum ${muted}`}>{formatInteger(config.capitalRequirement.minimumUSD)} USC</div>
          </div>
          <Sparkline
            data={strategy.equityCurve}
            id={`card-${config.slug}`}
            name={config.name}
            tone={dark ? 'dark' : 'light'}
            className="h-14 w-full max-w-[150px]"
          />
        </div>

        <dl className={`mt-7 pt-5 border-t ${rule} grid grid-cols-3`}>
          {metrics.map(([label, value], i) => (
            <div key={label} className={`flex flex-col justify-between gap-1.5 ${i === 0 ? 'pr-3' : `px-3 border-l ${rule}`}`}>
              <dt className={`${labelCls} text-[10px] tracking-[0.12em]`}>{label}</dt>
              <dd className="font-display text-[22px] leading-none tnum">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`px-7 sm:px-8 py-4 border-t ${rule} flex items-center justify-between gap-3`}>
        <span className={`text-xs tnum ${muted}`}>
          {formatDateShort(config.testPeriod.startDate)} to {formatDateShort(config.testPeriod.endDate)}
        </span>
        <span className={`link-gold ${dark ? 'text-gold-soft' : ''}`}>
          View strategy <ArrowUpRight size={14} />
        </span>
      </div>
    </article>
  );
}
