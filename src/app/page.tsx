import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { SectionHeading } from '@/components/SectionHeading';
import { Sparkline } from '@/components/charts/Sparkline';
import { TIER_LABELS } from '@/config/brand';
import { formatInteger, formatPercentUnsigned, formatDateShort } from '@/lib/formatters';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

const PRINCIPLES = [
  {
    numeral: 'I',
    title: 'Mean reversion at the core',
    body: 'Each system looks for statistically stretched moves in gold and positions for their return toward balance, long or short.',
  },
  {
    numeral: 'II',
    title: 'Evidence over anecdote',
    body: 'Every figure on this site is taken from MetaTrader 5 Strategy Tester reports run on 100% real tick data, with the broker’s spreads and swaps.',
  },
  {
    numeral: 'III',
    title: 'Sized to your account',
    body: 'Three tiers from 1L to 10L, each specified for the cent-account balance it was tested at, so expectations match the evidence.',
  },
];

const FAQS = [
  {
    q: 'Are these live trading results?',
    a: 'No. All performance data comes from MetaTrader 5 Strategy Tester backtests using real tick data on demo accounts. Forward testing is planned but not yet completed.',
  },
  {
    q: 'What broker do I need?',
    a: 'The backtests were run on Vantage Markets with 1:500 leverage. Any broker offering XAUUSD on MetaTrader 5 with similar conditions should work, though actual results will vary.',
  },
  {
    q: 'What do the capital figures and “USC” mean?',
    a: 'These run on cent accounts, so balances and P&L are quoted in USC (US cents), where 100 USC = 1 USD. Values are shown exactly as the MT5 reports state them, with no conversion. Each strategy is specified for a balance: GTC Mini 100,000 USC (1L), GTC Micro 300,000 USC (3L), GTC Standard 1,000,000 USC (10L). GTC Micro is rebased from a 500,000 USC source backtest. Deploying below the specified balance raises the risk that a news-driven floating drawdown exceeds the account.',
  },
  {
    q: 'How do I get started?',
    a: 'Use the “Request evaluation” form to share your details. We will assess suitability and provide next steps for your preferred strategy.',
  },
];

export default function HomePage() {
  const strategies = getAllStrategies();
  const totalTrades = strategies.reduce((sum, s) => sum + s.originalMetrics.totalTrades, 0);
  const spanYears = Math.max(...strategies.map((s) => s.config.testPeriod.spanYears));
  const start = strategies.map((s) => s.config.testPeriod.startDate).sort()[0];
  const end = strategies.map((s) => s.config.testPeriod.endDate).sort().at(-1)!;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="paper relative overflow-hidden border-b border-line">
        <div className={`${container} pt-10 pb-20 lg:pt-16 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center`}>
          <div className="lg:col-span-6">
            <p className="eyebrow rise">XAUUSD · Systematic strategies</p>
            <h1 className="mt-7 font-display text-[50px] sm:text-[68px] xl:text-[78px] leading-[0.96] tracking-[-0.025em] text-ink rise rise-1">
              Disciplined capital,
              <br />
              <em className="text-gold-deep">engineered</em> for gold.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-2 rise rise-2">
              Golden Teak Capital builds mean-reversion strategies for XAUUSD: three tiers, each sized to the account
              it was tested on and documented with real-tick backtest data.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 rise rise-3">
              <Link href="/algos" className="btn btn-dark">
                Explore the strategies <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Request evaluation
              </Link>
            </div>

            <dl className="mt-14 pt-8 border-t border-line grid grid-cols-3 gap-6 max-w-lg rise rise-4">
              {[
                ['Test window', `${spanYears.toFixed(1)} yrs`],
                ['Tick data', '100%'],
                ['Trades tested', formatInteger(totalTrades)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label text-[10px]">{k}</dt>
                  <dd className="mt-2 font-display text-[28px] leading-none text-ink tnum">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Strategy ledger */}
          <div className="lg:col-span-6 lg:pl-6 rise rise-2">
            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 rounded-[10px] border border-gold/30" aria-hidden="true" />
              <div className="card relative p-6 sm:p-9">
                <div>
                  <p className="eyebrow">Strategy ledger</p>
                  <p className="mt-3 font-display text-[26px] leading-tight text-ink">Backtest summary</p>
                </div>

                <ul className="mt-8 border-t border-line">
                  {strategies.map((s) => (
                    <li key={s.config.id} className="border-b border-line">
                      <Link
                        href={`/algos/${s.config.slug}`}
                        className="group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_7.5rem_auto] items-center gap-6 py-5"
                      >
                        <div className="min-w-0">
                          <div className="font-display text-[21px] text-ink group-hover:text-gold-deep transition-colors whitespace-nowrap">
                            {s.config.name}
                          </div>
                          <div className="mt-1 text-xs text-ink-3 tnum whitespace-nowrap">
                            {s.config.capitalRequirement.minimumINR} · {formatInteger(s.config.capitalRequirement.minimumUSD)} USC
                          </div>
                        </div>
                        <Sparkline
                          data={s.equityCurve}
                          id={`ledger-${s.config.slug}`}
                          name={s.config.name}
                          className="hidden sm:block h-11 w-full"
                        />
                        <div className="text-right">
                          <div className="font-display text-[26px] leading-none text-ink tnum">
                            {formatPercentUnsigned(s.originalMetrics.cagr)}
                          </div>
                          <div className="mt-1.5 label text-[9.5px]">CAGR</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] text-ink-3 tnum">
                  As-tested · {formatDateShort(start)} to {formatDateShort(end)} · cent accounts (USC)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Approach ─────────────────────────────────────── */}
      <section id="approach" className={`${container} py-24 lg:py-32 scroll-mt-24`}>
        <div className="flex justify-center">
          <span className="rule-ornament eyebrow">Our approach</span>
        </div>
        <h2 className="mt-8 mx-auto max-w-3xl text-center font-display text-[34px] sm:text-[48px] leading-[1.08] tracking-[-0.015em] text-ink">
          Patience is a strategy. <em className="text-gold-deep">We simply made it systematic.</em>
        </h2>
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {PRINCIPLES.map((p, i) => (
            <div key={p.numeral} className={`md:px-10 ${i > 0 ? 'md:border-l md:border-line' : 'md:pl-0'} ${i === 2 ? 'md:pr-0' : ''}`}>
              <div className="font-display italic text-[44px] leading-none text-gold">{p.numeral}</div>
              <h3 className="mt-6 font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The suite ────────────────────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24 lg:py-28`}>
          <SectionHeading
            eyebrow="The GTC suite"
            title={
              <>
                Three tiers, <em className="text-gold-deep">one discipline.</em>
              </>
            }
            description="Ordered by the capital each was tested on. Choose the tier that matches your account. The figures assume that balance."
            aside={
              <Link href="/algos" className="link-gold">
                Full portfolio <ArrowUpRight size={14} />
              </Link>
            }
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {strategies.map((s) => (
              <StrategyCard key={s.config.id} strategy={s} featured={s.config.shortName === 'Standard'} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Capital ladder ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso text-on-dark">
        <div className={`${container} py-24 lg:py-28`}>
          <SectionHeading
            tone="dark"
            eyebrow="Capital ladder"
            title={
              <>
                Start where your <em className="text-gold-soft">capital</em> is.
              </>
            }
            description="Balances are quoted in USC on cent accounts (100 USC = 1 USD), exactly as the reports state them. Deploying below a tier’s tested balance thins the buffer against news-driven floating drawdowns."
          />

          <div className="mt-16 relative">
          <div className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-gradient-to-r from-gold-soft/20 via-gold-soft/60 to-gold-soft/20" aria-hidden="true" />
          <div className="md:hidden absolute top-0 bottom-0 left-[7px] w-px bg-gold-soft/30" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {strategies.map((s) => {
              const tier = TIER_LABELS[s.config.shortName];
              return (
                <li key={s.config.id} className="relative pl-10 md:pl-0">
                  <span className="absolute left-0 md:static block h-[15px] w-[15px] rounded-full border-2 border-gold-soft bg-espresso" aria-hidden="true" />
                  <p className="md:mt-8 eyebrow-dark">Tier {tier?.numeral} · {tier?.label}</p>
                  <div className="mt-4 font-display text-[72px] leading-[0.85] text-gold-soft">
                    {s.config.capitalRequirement.minimumINR}
                  </div>
                  <Link href={`/algos/${s.config.slug}`} className="mt-5 inline-flex items-center gap-2 font-display text-2xl text-on-dark hover:text-gold-soft transition-colors">
                    {s.config.name} <ArrowUpRight size={16} />
                  </Link>
                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between gap-4 border-b border-on-dark/10 pb-2">
                      <dt className="text-on-dark-2">Tested balance</dt>
                      <dd className="tnum">{formatInteger(s.config.capitalRequirement.minimumUSD)} USC</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-on-dark/10 pb-2">
                      <dt className="text-on-dark-2">Leverage</dt>
                      <dd className="tnum">{s.config.capitalRequirement.leverage}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-on-dark-2">Direction</dt>
                      <dd>{s.config.direction}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ol>
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────── */}
      <section className={`${container} py-24 lg:py-28`}>
        <SectionHeading
          eyebrow="Head-to-head"
          title="Every figure, side by side."
          description="Compare the three tiers across performance and risk. Add or remove columns and sort by any metric."
        />
        <div className="mt-12 card p-5 sm:p-8">
          <ComparisonTable strategies={strategies} />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12`}>
          <div className="lg:col-span-4">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
              Before you <em className="text-gold-deep">begin.</em>
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed">
              Anything else on your mind? We answer every evaluation request personally.
            </p>
            <Link href="/contact" className="mt-8 link-gold">
              Ask us directly <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="lg:col-span-8 border-t border-ink/70">
            {FAQS.map((faq) => (
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
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className={`${container} py-24`}>
        <div className="relative overflow-hidden rounded-[8px] bg-espresso px-8 py-20 sm:px-16 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-soft to-transparent" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow-dark">Private evaluation</p>
            <h2 className="mt-5 mx-auto max-w-2xl font-display text-4xl sm:text-[54px] leading-[1.05] text-on-dark">
              Begin with a conversation, <em className="text-gold-soft">not a commitment.</em>
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-on-dark-2 leading-relaxed">
              Share your capital, broker and goals. We&rsquo;ll recommend the tier that fits, or tell you plainly if
              none does.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-gold">
                Request evaluation <ArrowRight size={14} />
              </Link>
              <Link href="/algos" className="btn btn-ghost-light">
                Review the strategies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
