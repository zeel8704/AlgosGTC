import Link from 'next/link';
import type { StrategyData, MetricKey } from '@/types';
import { TIER_LABELS } from '@/config/brand';
import { getAllStrategies } from '@/data/strategies';
import { EquityCurveChart } from '@/components/charts/EquityCurveChart';
import { MonthlyHeatmap } from '@/components/charts/MonthlyHeatmap';
import { Sparkline } from '@/components/charts/Sparkline';
import { MetricCard, MetricGrid } from '@/components/MetricCard';
import { SectionHeading } from '@/components/SectionHeading';
import { metricText } from '@/lib/metrics';
import {
  formatCurrency, formatPercentUnsigned, formatRatio, formatInteger, formatDateShort,
} from '@/lib/formatters';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

type Trend = 'positive' | 'negative' | 'neutral';

export function AlgoDetail({ strategy: s }: { strategy: StrategyData }) {
  const m = s.originalMetrics;
  const cap = s.config.capitalRequirement;
  const tier = TIER_LABELS[s.config.shortName];
  const startLabel = formatDateShort(s.config.testPeriod.startDate);
  const endLabel = formatDateShort(s.config.testPeriod.endDate);
  const others = getAllStrategies().filter((o) => o.config.id !== s.config.id);

  const fig = (key: MetricKey, value: string, trend?: Trend) => {
    const t = metricText(key);
    return { key, label: t.label, technical: t.technical, help: t.help, value, trend };
  };

  const keyFigures = [
    fig('cagr', formatPercentUnsigned(m.cagr), 'positive'),
    fig('totalNetProfit', formatCurrency(m.totalNetProfit, { compact: true }), 'positive'),
    fig('maxDrawdownPct', formatPercentUnsigned(m.maxDrawdownPct), 'negative'),
    fig('equityDDMaxPct', formatPercentUnsigned(m.equityDDMaxPct), 'negative'),
    fig('profitFactor', formatRatio(m.profitFactor)),
    fig('marRatio', formatRatio(m.marRatio)),
    fig('winRate', formatPercentUnsigned(m.winRate)),
    fig('totalTrades', formatInteger(m.totalTrades)),
  ];

  const tradeStats = [
    fig('grossProfit', formatCurrency(m.grossProfit, { compact: true }), 'positive'),
    fig('grossLoss', formatCurrency(m.grossLoss, { compact: true }), 'negative'),
    fig('winningTrades', formatInteger(m.winningTrades)),
    fig('losingTrades', formatInteger(m.losingTrades)),
    fig('avgProfitTrade', formatCurrency(m.avgProfitTrade), 'positive'),
    fig('avgLossTrade', formatCurrency(m.avgLossTrade), 'negative'),
    fig('largestProfitTrade', formatCurrency(m.largestProfitTrade, { compact: true }), 'positive'),
    fig('largestLossTrade', formatCurrency(m.largestLossTrade, { compact: true }), 'negative'),
    fig('expectedPayoff', formatCurrency(m.expectedPayoff)),
    fig('recoveryFactor', formatRatio(m.recoveryFactor)),
    fig('avgHoldTime', m.avgHoldTime),
    fig('sharpeRatio', formatRatio(m.sharpeRatio)),
  ];

  const aboutTest: [string, string][] = [
    ['Test period', `${startLabel} to ${endLabel}`],
    ['Length', `${s.config.testPeriod.spanYears} years`],
    ['Price data', `${s.config.testPeriod.historyQuality}, minute by minute`],
    ['Type', 'Backtest: a replay of past prices in MetaTrader 5'],
    ['Live results', 'Not yet available'],
    ['Market', 'Gold (XAUUSD)'],
  ];

  const whatYouNeed: [string, string][] = [
    ['Start with', `${cap.minimumINR} (${formatInteger(cap.minimumUSD)} USC, about ${formatInteger(cap.minimumUSD / 100)} USD)`],
    ['Account type', 'Cent account (100 USC = 1 USD)'],
    ['Leverage', cap.leverage],
    ['Broker tested on', s.config.platform.broker],
    ['Platform', s.config.platform.platform],
    ['Trades', s.config.direction],
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="paper border-b border-line">
        <div className={`${container} pt-8 pb-16 lg:pb-24`}>
          <Link href="/algos" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-3 hover:text-ink transition-colors">
            <ArrowLeft size={13} /> All plans
          </Link>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow rise">Plan {tier?.numeral} · {tier?.label}</p>
              <h1 className="mt-5 font-display text-[54px] sm:text-[80px] leading-[0.92] tracking-[-0.025em] text-ink rise rise-1">
                {s.config.name}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2 rise rise-2">{s.config.description}</p>
              <ul className="mt-8 flex flex-wrap gap-2 rise rise-3">
                {['Gold (XAUUSD)', s.config.strategyFamily, s.config.direction, 'MetaTrader 5'].map((t) => (
                  <li key={t} className="rounded-full border border-line-strong bg-ivory/70 px-3.5 py-1.5 text-xs font-medium text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-5 rise rise-2">
              <div className="card p-7 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="label">Start with</div>
                    <div className="mt-3 font-display text-[68px] leading-[0.85] text-gold-deep">{cap.minimumINR}</div>
                    <div className="mt-3 text-sm tnum text-ink-2">
                      {formatInteger(cap.minimumUSD)} USC · about {formatInteger(cap.minimumUSD / 100)} USD
                    </div>
                  </div>
                  <Sparkline data={s.equityCurve} id={`hero-${s.config.slug}`} name={s.config.name} className="mt-2 h-14 w-24 shrink-0 sm:h-16 sm:w-full sm:max-w-[150px]" />
                </div>
                <dl className="mt-7 pt-6 border-t border-line grid grid-cols-2 gap-5">
                  <div>
                    <dt className="label">Tested over</dt>
                    <dd className="mt-1.5 text-sm text-ink tnum">{startLabel} to {endLabel}</dd>
                  </div>
                  <div>
                    <dt className="label">Price data</dt>
                    <dd className="mt-1.5 text-sm text-ink">{s.config.testPeriod.historyQuality}</dd>
                  </div>
                </dl>
                <Link href={`/contact?algo=${s.config.slug}`} className="btn btn-dark w-full mt-7">
                  Get started <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── In plain terms ───────────────────── */}
      <section className={`${container} pt-16 lg:pt-20`}>
        <div className="rounded-[6px] border border-gold/40 bg-sand/50 p-7 sm:p-9">
          <p className="eyebrow">In plain terms</p>
          <p className="mt-4 max-w-4xl font-display text-[22px] sm:text-[26px] leading-snug text-ink">
            {s.config.name} is our {tier?.label.toLowerCase()} plan, tested from a starting balance of {cap.minimumINR} (
            {formatInteger(cap.minimumUSD)} USC). Over the {s.config.testPeriod.spanYears}-year test it grew{' '}
            <strong className="text-positive">{formatPercentUnsigned(m.cagr)} a year</strong> on average and finished{' '}
            {formatCurrency(m.totalNetProfit, { compact: true })} in profit. At its worst moment, open trades were down{' '}
            <strong className="text-negative">{formatPercentUnsigned(m.equityDDMaxPct)}</strong> of the account&rsquo;s value
            before recovering; the biggest fall between closed trades was {formatPercentUnsigned(m.maxDrawdownPct)}.
          </p>
          <p className="mt-4 text-sm text-ink-3">
            These are results from a replay of past prices, not live trading.{' '}
            <Link href="/how-it-works#risks" className="text-gold-deep underline underline-offset-2">
              Read the risks
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Key figures ──────────────────────── */}
      <section className={`${container} py-16 lg:py-20`}>
        <SectionHeading
          eyebrow="Results from the test"
          title="The key figures"
          description="Tap the small i next to any figure for what it means."
          aside={
            <span className="rounded-full border border-line-strong px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Backtest, not live · USC
            </span>
          }
        />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
          {keyFigures.map((f) => (
            <div key={f.key} className="border-r border-b border-line bg-ivory/50 p-6 sm:p-8">
              <MetricCard label={f.label} technical={f.technical} value={f.value} trend={f.trend} tooltip={f.help} size="lg" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Equity curve ─────────────────────── */}
      <section className={`${container} pb-8`}>
        <div className="card p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow">Growth</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">How the account grew</h2>
            </div>
            <div className="text-right">
              <div className="label">Start to end</div>
              <div className="mt-2 font-display text-2xl text-ink tnum">
                {formatCurrency(s.equityCurve[0]?.balance, { compact: true })}
                <span className="mx-2 text-gold">→</span>
                {formatCurrency(s.equityCurve[s.equityCurve.length - 1]?.balance, { compact: true })}
              </div>
            </div>
          </div>
          <EquityCurveChart data={s.equityCurve} label="Balance" height={380} />
          <p className="mt-6 text-xs leading-relaxed text-ink-3">
            The account balance at the end of each day of the test, counting closed trades. Dips while trades were still
            open are not drawn here; the deepest one is the &ldquo;Deepest open-trade dip&rdquo; figure above.
          </p>
        </div>
      </section>

      {/* ── Monthly returns ──────────────────── */}
      <section className={`${container} py-8`}>
        <div className="card p-6 sm:p-10">
          <div className="mb-10">
            <p className="eyebrow">Consistency</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Month by month</h2>
            <p className="mt-3 text-sm text-ink-3">
              Each cell is that month&rsquo;s gain or loss as a percentage of the balance at the start of the month.
            </p>
          </div>
          <MonthlyHeatmap data={s.monthlyReturns} />
        </div>
      </section>

      {/* ── Trade statistics ─────────────────── */}
      <section className={`${container} py-8`}>
        <div className="card p-6 sm:p-10">
          <div className="mb-10">
            <p className="eyebrow">The trades</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Trade statistics</h2>
          </div>
          <MetricGrid columns={4}>
            {tradeStats.map((f) => (
              <MetricCard key={f.key} label={f.label} technical={f.technical} value={f.value} trend={f.trend} tooltip={f.help} />
            ))}
          </MetricGrid>
        </div>
      </section>

      {/* ── About the test + what you need ───── */}
      <section className={`${container} py-8 pb-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { eyebrow: 'Where the numbers come from', title: 'About the test', rows: aboutTest },
            { eyebrow: 'To run this plan', title: 'What you need', rows: whatYouNeed, note: cap.note },
          ].map((block) => (
            <div key={block.title} className="card p-6 sm:p-10">
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl text-ink">{block.title}</h2>
              <dl className="mt-8">
                {block.rows.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-0">
                    <dt className="text-sm text-ink-3">{k}</dt>
                    <dd className="text-sm font-medium text-ink text-right tnum">{v}</dd>
                  </div>
                ))}
              </dl>
              {block.note && <p className="mt-6 text-xs leading-relaxed text-ink-3">{block.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Other plans ──────────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-20`}>
          <SectionHeading eyebrow="The other plans" title="Compare with the other two" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {others.map((o) => {
              const t = TIER_LABELS[o.config.shortName];
              return (
                <Link
                  key={o.config.id}
                  href={`/algos/${o.config.slug}`}
                  className="group card card-hover flex items-center justify-between gap-6 p-7"
                >
                  <div>
                    <p className="eyebrow">Plan {t?.numeral} · {t?.label}</p>
                    <div className="mt-3 font-display text-3xl text-ink">{o.config.name}</div>
                    <div className="mt-2 text-sm text-ink-3 tnum">
                      Start with {o.config.capitalRequirement.minimumINR} · growth {formatPercentUnsigned(o.originalMetrics.cagr)} a year ·
                      deepest dip {formatPercentUnsigned(o.originalMetrics.equityDDMaxPct)}
                    </div>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-2 group-hover:bg-ink group-hover:border-ink group-hover:text-on-dark transition-colors">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso">
        <div className={`${container} relative py-24 text-center`}>
          <p className="eyebrow-dark">Next step</p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl text-on-dark leading-tight">
            Start with {s.config.name}, <em className="text-gold-soft">or ask if it fits.</em>
          </h2>
          <p className="mt-5 mx-auto max-w-lg text-on-dark-2">
            Tell us what you can start with. We&rsquo;ll confirm whether this plan suits you and share pricing. Free,
            with no obligation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/contact?algo=${s.config.slug}`} className="btn btn-gold">
              Get started <ArrowRight size={14} />
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost-light">
              How it works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
