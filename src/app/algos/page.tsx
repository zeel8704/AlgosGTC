import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { SectionHeading } from '@/components/SectionHeading';
import { formatInteger, formatPercentUnsigned } from '@/lib/formatters';
import { TIER_LABELS } from '@/config/brand';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Plans',
  description:
    'The three GTC plans, GTC Mini, GTC Micro and GTC Standard, chosen by how much you start with, each with results from a 2.7-year test on real gold prices.',
};

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

export default function AlgosPage() {
  const strategies = getAllStrategies();

  return (
    <>
      {/* Header */}
      <section className="paper border-b border-line">
        <div className={`${container} pt-12 pb-16 lg:pt-16 lg:pb-20`}>
          <p className="eyebrow rise">Plans</p>
          <h1 className="mt-6 max-w-4xl font-display text-[48px] sm:text-[72px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
            Three plans, chosen by <em className="text-gold-deep">what you start with.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 rise rise-2">
            All three run the same GTC gold algorithm. They differ in the account size each was built and tested for,
            and in how aggressively each trades. The figures assume you start with the balance shown; starting with
            less leaves a thinner buffer when open trades dip.
          </p>
        </div>
      </section>

      {/* Quick chooser */}
      <section className={`${container} pt-16`}>
        <div className="card p-6 sm:p-8">
          <p className="label mb-5">Which plan is for me?</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map((s) => {
              const tier = TIER_LABELS[s.config.shortName];
              return (
                <li key={s.config.id}>
                  <Link
                    href={`/algos/${s.config.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-[4px] border border-line bg-sand/40 px-5 py-4 hover:border-ink transition-colors"
                  >
                    <span>
                      <span className="block text-sm text-ink-2">
                        I can start with about <strong className="font-semibold text-ink tnum">{s.config.capitalRequirement.minimumINR}</strong>
                      </span>
                      <span className="mt-1 block font-display text-xl text-ink group-hover:text-gold-deep transition-colors">
                        {s.config.name} <span className="text-sm text-ink-3">· {tier?.label}</span>
                      </span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-ink-3 group-hover:text-ink transition-colors" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-ink-3">
            1L is 100,000 USC, about 1,000 USD. Not sure? Pick the plan whose starting balance you can comfortably
            exceed, or ask us.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className={`${container} py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {strategies.map((s) => (
            <StrategyCard key={s.config.id} strategy={s} featured={s.config.shortName === 'Standard'} />
          ))}
        </div>
      </section>

      {/* What you need to start */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24`}>
          <SectionHeading
            eyebrow="Starting balance"
            title="What each plan needs to start."
            description="Balances are in USC, the unit of a cent account: 100 USC is 1 USD. Each plan was tested starting from the balance shown, with 1:500 leverage at Vantage."
          />
          <div className="mt-12 card p-5 sm:p-8">
            <div className="table-scroll">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-ink/80 text-left">
                    {['Plan', 'Start with', 'In USC', 'In USD', 'Trades', 'Leverage', 'Deepest open-trade dip in test'].map((h) => (
                      <th key={h} scope="col" className="py-3 pr-6 label text-[10px] last:pr-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((s) => {
                    const tier = TIER_LABELS[s.config.shortName];
                    const usd = s.config.capitalRequirement.minimumUSD / 100;
                    return (
                      <tr key={s.config.id} className="border-b border-line last:border-0 hover:bg-sand/40 transition-colors">
                        <th scope="row" className="py-5 pr-6 text-left font-normal">
                          <Link href={`/algos/${s.config.slug}`} className="font-display text-lg text-ink hover:text-gold-deep transition-colors">
                            {s.config.name}
                          </Link>
                          <div className="text-[11px] text-ink-3">Plan {tier?.numeral} · {tier?.label}</div>
                        </th>
                        <td className="py-5 pr-6 font-display text-xl text-gold-deep">{s.config.capitalRequirement.minimumINR}</td>
                        <td className="py-5 pr-6 text-sm tnum text-ink">{formatInteger(s.config.capitalRequirement.minimumUSD)} USC</td>
                        <td className="py-5 pr-6 text-sm tnum text-ink-2">about {formatInteger(usd)} USD</td>
                        <td className="py-5 pr-6 text-sm text-ink-2">{s.config.direction}</td>
                        <td className="py-5 pr-6 text-sm tnum text-ink-2">{s.config.capitalRequirement.leverage}</td>
                        <td className="py-5 text-sm tnum text-negative">{formatPercentUnsigned(s.originalMetrics.equityDDMaxPct)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-ink-3">
              The deepest open-trade dip is how far the account value fell at the worst moment of the test while trades
              were still open, before they recovered. Size your starting balance for it.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={`${container} py-24`}>
        <SectionHeading
          eyebrow="Side by side"
          title="All the numbers, side by side."
          description="Add or remove columns and sort by any figure. Every heading is explained on the How it works page."
          aside={
            <Link href="/how-it-works#numbers" className="link-gold">
              The numbers, explained <ArrowUpRight size={14} />
            </Link>
          }
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
              Not sure which plan fits? <em className="text-gold-deep">Ask us.</em>
            </h2>
            <p className="mt-3 text-ink-2">Tell us what you can start with and we will recommend one, free and with no obligation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn btn-dark">
              Get started <ArrowRight size={14} />
            </Link>
            <Link href="/how-it-works" className="btn btn-outline">
              How it works <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
