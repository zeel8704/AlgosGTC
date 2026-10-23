import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { SectionHeading } from '@/components/SectionHeading';
import { formatInteger } from '@/lib/formatters';
import { CENT_ACCOUNT_NOTE, TIER_LABELS } from '@/config/brand';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strategies',
  description:
    'The GTC strategy suite: three XAUUSD mean-reversion strategies with documented backtest performance and capital requirements.',
};

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

export default function AlgosPage() {
  const strategies = getAllStrategies();

  return (
    <>
      {/* Header */}
      <section className="paper border-b border-line">
        <div className={`${container} pt-12 pb-16 lg:pt-16 lg:pb-20`}>
          <p className="eyebrow rise">Strategies</p>
          <h1 className="mt-6 max-w-4xl font-display text-[48px] sm:text-[72px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
            The GTC <em className="text-gold-deep">strategy suite.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 rise rise-2">
            Three independent MetaTrader 5 strategies for XAUUSD, backtested on 100% real tick data over the same
            ~2.7-year window. They share a mean-reversion discipline and differ in the account size they were built for.
            Every figure is taken from, or reconciled to, the source Strategy Tester reports.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className={`${container} py-20`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {strategies.map((s) => (
            <StrategyCard key={s.config.id} strategy={s} featured={s.config.shortName === 'Standard'} />
          ))}
        </div>
      </section>

      {/* Capital requirements */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24`}>
          <SectionHeading eyebrow="Capital" title="Capital requirements" description={CENT_ACCOUNT_NOTE} />
          <div className="mt-12 card p-5 sm:p-8">
            <div className="table-scroll">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-ink/80 text-left">
                    {['Tier', 'Strategy', 'Tested balance', 'Label', 'Direction', 'Leverage'].map((h) => (
                      <th key={h} scope="col" className="py-3 pr-6 label text-[10px] last:pr-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((s) => {
                    const tier = TIER_LABELS[s.config.shortName];
                    return (
                      <tr key={s.config.id} className="border-b border-line last:border-0 hover:bg-sand/40 transition-colors">
                        <td className="py-5 pr-6 font-display italic text-xl text-gold">{tier?.numeral}</td>
                        <th scope="row" className="py-5 pr-6 text-left font-normal">
                          <Link href={`/algos/${s.config.slug}`} className="font-display text-lg text-ink hover:text-gold-deep transition-colors">
                            {s.config.name}
                          </Link>
                          <div className="text-[11px] text-ink-3">{tier?.label}</div>
                        </th>
                        <td className="py-5 pr-6 text-sm tnum text-ink">{formatInteger(s.config.capitalRequirement.minimumUSD)} USC</td>
                        <td className="py-5 pr-6 font-display text-xl text-gold-deep">{s.config.capitalRequirement.minimumINR}</td>
                        <td className="py-5 pr-6 text-sm text-ink-2">{s.config.direction}</td>
                        <td className="py-5 text-sm tnum text-ink-2">{s.config.capitalRequirement.leverage}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-ink-3">
              Different cent-account balances are not directly comparable as &ldquo;cost&rdquo;; they are the balances each
              system was tested at.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={`${container} py-24`}>
        <SectionHeading
          eyebrow="Head-to-head"
          title="Every figure, side by side."
          description="Add or remove columns and sort by any metric to compare the tiers on your own terms."
        />
        <div className="mt-12 card p-5 sm:p-8">
          <ComparisonTable strategies={strategies} />
        </div>
      </section>

      {/* CTA */}
      <section className={`${container} pb-24`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-ink/80 pt-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Not sure which tier fits? <em className="text-gold-deep">Ask us.</em>
            </h2>
            <p className="mt-3 text-ink-2">We&rsquo;ll match a strategy to your capital, broker and risk tolerance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn btn-dark">
              Request evaluation <ArrowRight size={14} />
            </Link>
            <Link href="/#approach" className="btn btn-outline">
              Our approach <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
