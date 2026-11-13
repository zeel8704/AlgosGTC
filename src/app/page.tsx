import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { SectionHeading } from '@/components/SectionHeading';
import { Sparkline } from '@/components/charts/Sparkline';
import { PlainTerms } from '@/components/explain/PlainTerms';
import { Steps } from '@/components/explain/Steps';
import { Risks } from '@/components/explain/Risks';
import { Faq } from '@/components/explain/Faq';
import { Glossary } from '@/components/explain/Glossary';
import { HOME_FAQ_COUNT } from '@/content/explain';
import { formatInteger, formatPercentUnsigned, formatDateShort } from '@/lib/formatters';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

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
            <p className="eyebrow rise">Managed gold trading</p>
            <h1 className="mt-7 font-display text-[48px] sm:text-[66px] xl:text-[76px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
              We trade gold for you, <em className="text-gold-deep">in your own account.</em>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-2 rise rise-2">
              Golden Teak Capital runs its GTC trading algorithm on your MetaTrader 5 account. Your money stays with
              your broker, you watch every trade on your phone, and you can stop us at any time. Three plans, matched
              to how much you start with.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 rise rise-3">
              <Link href="/how-it-works" className="btn btn-dark">
                See how it works <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Get started
              </Link>
            </div>

            <dl className="mt-14 pt-8 border-t border-line grid grid-cols-3 gap-6 max-w-lg rise rise-4">
              {[
                ['Years of price history tested', `${spanYears.toFixed(1)}`],
                ['Real price data', '100%'],
                ['Trades in the test', formatInteger(totalTrades)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label text-[10px] leading-snug">{k}</dt>
                  <dd className="mt-2 font-display text-[28px] leading-none text-ink tnum">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Results at a glance */}
          <div className="lg:col-span-6 lg:pl-6 rise rise-2">
            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 rounded-[10px] border border-gold/30" aria-hidden="true" />
              <div className="card relative p-6 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">Test results at a glance</p>
                    <p className="mt-3 font-display text-[26px] leading-tight text-ink">Three plans, three balances</p>
                  </div>
                  <span className="rounded-full border border-line-strong px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    Backtest, not live
                  </span>
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
                            Start with {s.config.capitalRequirement.minimumINR} · {formatInteger(s.config.capitalRequirement.minimumUSD)} USC
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
                          <div className="mt-1.5 label text-[9.5px]">Growth / year</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] leading-relaxed text-ink-3 tnum">
                  Average yearly growth in a replay of {formatDateShort(start)} to {formatDateShort(end)}. Balances in
                  USC, a cent-account unit (100 USC = 1 USD).{' '}
                  <Link href="/how-it-works#numbers" className="text-gold-deep underline underline-offset-2">
                    What do these numbers mean?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── In plain terms ───────────────────────────────── */}
      <section id="plain-terms" className={`${container} py-24 lg:py-28 scroll-mt-24`}>
        <SectionHeading
          eyebrow="In plain terms"
          title={
            <>
              What you are <em className="text-gold-deep">actually getting.</em>
            </>
          }
          description="No software to install and no trading to learn. We run the algorithm; you keep the account."
        />
        <div className="mt-12">
          <PlainTerms />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24 lg:py-28`}>
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                From first call to first trade, <em className="text-gold-deep">in five steps.</em>
              </>
            }
            aside={
              <Link href="/how-it-works" className="link-gold">
                The full picture <ArrowUpRight size={14} />
              </Link>
            }
          />
          <div className="mt-14">
            <Steps layout="row" />
          </div>
        </div>
      </section>

      {/* ── Plans ────────────────────────────────────────── */}
      <section className={`${container} py-24 lg:py-28`}>
        <SectionHeading
          eyebrow="Three plans"
          title={
            <>
              Pick by what you can <em className="text-gold-deep">start with.</em>
            </>
          }
          description="Each plan is the same GTC algorithm, set up for a different account size. The figures on each card assume you start with that balance."
          aside={
            <Link href="/algos" className="link-gold">
              Compare the plans <ArrowUpRight size={14} />
            </Link>
          }
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {strategies.map((s) => (
            <StrategyCard key={s.config.id} strategy={s} featured={s.config.shortName === 'Standard'} />
          ))}
        </div>
      </section>

      {/* ── The numbers, explained ───────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12`}>
          <div className="lg:col-span-4">
            <p className="eyebrow">The numbers, explained</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
              Four terms that <em className="text-gold-deep">unlock the rest.</em>
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed">
              Every figure on this site is labelled in plain language, with the technical name one tap away. These
              four cover most of it.
            </p>
            <Link href="/how-it-works#numbers" className="mt-8 link-gold">
              Full glossary <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Glossary section="terms" limit={4} />
          </div>
        </div>
      </section>

      {/* ── Risks ────────────────────────────────────────── */}
      <section id="risks" className="bg-espresso text-on-dark scroll-mt-24">
        <div className={`${container} py-24 lg:py-28`}>
          <SectionHeading
            tone="dark"
            eyebrow="Risks, plainly"
            title={
              <>
                What can <em className="text-gold-soft">go wrong.</em>
              </>
            }
            description="You should know these before you talk to us, not after. We would rather lose an enquiry than surprise a client."
          />
          <div className="mt-12">
            <Risks tone="dark" />
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────── */}
      <section className={`${container} py-24 lg:py-28`}>
        <SectionHeading
          eyebrow="Side by side"
          title="All the numbers, side by side."
          description="Compare the three plans on growth and risk. Tap any heading for a plain explanation, add or remove columns, and sort."
        />
        <div className="mt-12 card p-5 sm:p-8">
          <ComparisonTable strategies={strategies} />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12`}>
          <div className="lg:col-span-4">
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
              Before you <em className="text-gold-deep">begin.</em>
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed">
              The questions people ask us first. There are more on the How it works page, and we answer every enquiry
              personally.
            </p>
            <Link href="/how-it-works#faq" className="mt-8 link-gold">
              All questions <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Faq limit={HOME_FAQ_COUNT} />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className={`${container} py-24`}>
        <div className="relative overflow-hidden rounded-[8px] bg-espresso px-8 py-20 sm:px-16 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-soft to-transparent" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow-dark">Free evaluation</p>
            <h2 className="mt-5 mx-auto max-w-2xl font-display text-4xl sm:text-[54px] leading-[1.05] text-on-dark">
              Start with a conversation, <em className="text-gold-soft">not a commitment.</em>
            </h2>
            <p className="mt-6 mx-auto max-w-lg text-on-dark-2 leading-relaxed">
              Tell us how much you can start with. We&rsquo;ll recommend a plan, explain the numbers and share
              pricing. No charge, no obligation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-gold">
                Get started <ArrowRight size={14} />
              </Link>
              <Link href="/how-it-works" className="btn btn-ghost-light">
                Read how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
