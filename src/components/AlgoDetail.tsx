import Link from 'next/link';
import type { StrategyData } from '@/types';
import { TIER_LABELS } from '@/config/brand';
import { getAllStrategies } from '@/data/strategies';
import { EquityCurveChart } from '@/components/charts/EquityCurveChart';
import { MonthlyHeatmap } from '@/components/charts/MonthlyHeatmap';
import { Sparkline } from '@/components/charts/Sparkline';
import { MetricCard, MetricGrid } from '@/components/MetricCard';
import { SectionHeading } from '@/components/SectionHeading';
import {
  formatCurrency, formatPercentUnsigned, formatRatio, formatInteger, formatDateShort,
} from '@/lib/formatters';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

export function AlgoDetail({ strategy: s }: { strategy: StrategyData }) {
  const m = s.originalMetrics;
  const cap = s.config.capitalRequirement;
  const tier = TIER_LABELS[s.config.shortName];
  const period = `${formatDateShort(s.config.testPeriod.startDate)} to ${formatDateShort(s.config.testPeriod.endDate)}`;
  const others = getAllStrategies().filter((o) => o.config.id !== s.config.id);

  const keyFigures = [
    { label: 'CAGR', value: formatPercentUnsigned(m.cagr), trend: 'positive' as const, tooltip: 'Compound annual growth rate over the test period, from initial to final balance.' },
    { label: 'Net profit', value: formatCurrency(m.totalNetProfit, { compact: true }), trend: 'positive' as const, tooltip: 'Total realized profit in account currency (USC).' },
    { label: 'Max balance DD', value: formatPercentUnsigned(m.maxDrawdownPct), trend: 'negative' as const, tooltip: 'Largest peak-to-trough decline of the realized balance curve (deal level).' },
    { label: 'Max equity DD', value: formatPercentUnsigned(m.equityDDMaxPct), trend: 'negative' as const, tooltip: 'Largest floating (unrealized) drawdown of account equity, the true downside of this type of system. Report-only figure.' },
    { label: 'Profit factor', value: formatRatio(m.profitFactor), tooltip: 'Gross profit divided by gross loss.' },
    { label: 'MAR ratio', value: formatRatio(m.marRatio), tooltip: 'CAGR divided by max balance drawdown %. Higher is better risk-adjusted return.' },
    { label: 'Win rate', value: formatPercentUnsigned(m.winRate), tooltip: 'Share of closed trades that were profitable.' },
    { label: 'Total trades', value: formatInteger(m.totalTrades), tooltip: 'Closed round-trip trades (exit deals).' },
  ];

  const backtestRows: [string, string][] = [
    ['Test period', `${s.config.testPeriod.startDate} → ${s.config.testPeriod.endDate}`],
    ['Span', `${s.config.testPeriod.spanYears} years`],
    ['History quality', s.config.testPeriod.historyQuality],
    ['Type', 'Historical backtest (MT5 Strategy Tester)'],
    ['Forward test', 'Not yet available'],
    ['Symbol', s.config.platform.symbol],
    ['Timeframe', s.config.platform.timeframe],
  ];

  const capitalRows: [string, string][] = [
    ['Tested balance', `${formatCurrency(cap.minimumUSD, { decimals: 0 })} (${cap.minimumINR})`],
    ['Account type', 'Cent account (100 USC = 1 USD)'],
    ['Leverage', cap.leverage],
    ['Broker', s.config.platform.broker],
    ['Platform', s.config.platform.platform],
    ['EA version', s.reportMeta.version],
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="paper border-b border-line">
        <div className={`${container} pt-8 pb-16 lg:pb-24`}>
          <Link href="/algos" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-3 hover:text-ink transition-colors">
            <ArrowLeft size={13} /> All strategies
          </Link>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow rise">Tier {tier?.numeral} · {tier?.label}</p>
              <h1 className="mt-5 font-display text-[54px] sm:text-[80px] leading-[0.92] tracking-[-0.025em] text-ink rise rise-1">
                {s.config.name}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2 rise rise-2">{s.config.description}</p>
              <ul className="mt-8 flex flex-wrap gap-2 rise rise-3">
                {[s.config.platform.symbol, s.config.strategyFamily, s.config.direction, s.config.platform.platform].map((t) => (
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
                    <div className="label">Tested balance</div>
                    <div className="mt-3 font-display text-[68px] leading-[0.85] text-gold-deep">{cap.minimumINR}</div>
                    <div className="mt-3 text-sm tnum text-ink-2">
                      {formatInteger(cap.minimumUSD)} USC · {cap.leverage}
                    </div>
                  </div>
                  <Sparkline data={s.equityCurve} id={`hero-${s.config.slug}`} name={s.config.name} className="mt-2 h-14 w-24 shrink-0 sm:h-16 sm:w-full sm:max-w-[150px]" />
                </div>
                <dl className="mt-7 pt-6 border-t border-line grid grid-cols-2 gap-5">
                  <div>
                    <dt className="label">Test window</dt>
                    <dd className="mt-1.5 text-sm text-ink tnum">{period}</dd>
                  </div>
                  <div>
                    <dt className="label">Data</dt>
                    <dd className="mt-1.5 text-sm text-ink">{s.config.testPeriod.historyQuality}</dd>
                  </div>
                </dl>
                <Link href={`/contact?algo=${s.config.slug}`} className="btn btn-dark w-full mt-7">
                  Request evaluation <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Key figures ──────────────────────── */}
      <section className={`${container} py-20 lg:py-24`}>
        <SectionHeading
          eyebrow="Performance"
          title="Key figures"
          aside={<p className="text-sm text-ink-3">As-tested · full backtest period · USC</p>}
        />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
          {keyFigures.map((f) => (
            <div key={f.label} className="border-r border-b border-line bg-ivory/50 p-6 sm:p-8">
              <MetricCard label={f.label} value={f.value} trend={f.trend} tooltip={f.tooltip} size="lg" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Equity curve ─────────────────────── */}
      <section className={`${container} pb-8`}>
        <div className="card p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow">Equity</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Account balance</h2>
            </div>
            <div className="text-right">
              <div className="label">Start → end</div>
              <div className="mt-2 font-display text-2xl text-ink tnum">
                {formatCurrency(s.equityCurve[0]?.balance, { compact: true })}
                <span className="mx-2 text-gold">→</span>
                {formatCurrency(s.equityCurve[s.equityCurve.length - 1]?.balance, { compact: true })}
              </div>
            </div>
          </div>
          <EquityCurveChart data={s.equityCurve} label="Balance" height={380} />
          <p className="mt-6 text-xs text-ink-3">
            End-of-day account balance from the MT5 deals ledger: the realized balance curve. Intraday floating equity is
            not shown here.
          </p>
        </div>
      </section>

      {/* ── Monthly returns ──────────────────── */}
      <section className={`${container} py-8`}>
        <div className="card p-6 sm:p-10">
          <div className="mb-10">
            <p className="eyebrow">Consistency</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Monthly returns</h2>
            <p className="mt-3 text-sm text-ink-3">Percentage of start-of-month balance.</p>
          </div>
          <MonthlyHeatmap data={s.monthlyReturns} />
        </div>
      </section>

      {/* ── Trade statistics ─────────────────── */}
      <section className={`${container} py-8`}>
        <div className="card p-6 sm:p-10">
          <div className="mb-10">
            <p className="eyebrow">Execution</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Trade statistics</h2>
          </div>
          <MetricGrid columns={4}>
            <MetricCard label="Gross profit" value={formatCurrency(m.grossProfit, { compact: true })} trend="positive" />
            <MetricCard label="Gross loss" value={formatCurrency(m.grossLoss, { compact: true })} trend="negative" />
            <MetricCard label="Winning trades" value={formatInteger(m.winningTrades)} />
            <MetricCard label="Losing trades" value={formatInteger(m.losingTrades)} />
            <MetricCard label="Avg win" value={formatCurrency(m.avgProfitTrade)} trend="positive" />
            <MetricCard label="Avg loss" value={formatCurrency(m.avgLossTrade)} trend="negative" />
            <MetricCard label="Best trade" value={formatCurrency(m.largestProfitTrade, { compact: true })} trend="positive" />
            <MetricCard label="Worst trade" value={formatCurrency(m.largestLossTrade, { compact: true })} trend="negative" />
            <MetricCard label="Expected payoff" value={formatCurrency(m.expectedPayoff)} tooltip="Average net result per closed trade." />
            <MetricCard label="Recovery factor" value={formatRatio(m.recoveryFactor)} tooltip="Net profit divided by max balance drawdown." />
            <MetricCard label="Avg hold time" value={m.avgHoldTime} tooltip="Average time a position was held open (report-only)." />
            <MetricCard label="Sharpe ratio" value={formatRatio(m.sharpeRatio)} tooltip="Report-only risk-adjusted return." />
          </MetricGrid>
        </div>
      </section>

      {/* ── Backtest + capital ───────────────── */}
      <section className={`${container} py-8 pb-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { eyebrow: 'Provenance', title: 'Backtest details', rows: backtestRows },
            { eyebrow: 'Account', title: 'Capital & platform', rows: capitalRows, note: cap.note },
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

      {/* ── Other strategies ─────────────────── */}
      <section className="bg-sand/60 border-y border-line">
        <div className={`${container} py-20`}>
          <SectionHeading eyebrow="The GTC suite" title="Compare with the other tiers" />
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
                    <p className="eyebrow">Tier {t?.numeral} · {t?.label}</p>
                    <div className="mt-3 font-display text-3xl text-ink">{o.config.name}</div>
                    <div className="mt-2 text-sm text-ink-3 tnum">
                      {o.config.capitalRequirement.minimumINR} · CAGR {formatPercentUnsigned(o.originalMetrics.cagr)} · PF{' '}
                      {formatRatio(o.originalMetrics.profitFactor)}
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
            Evaluate {s.config.name} <em className="text-gold-soft">for your account.</em>
          </h2>
          <p className="mt-5 mx-auto max-w-lg text-on-dark-2">
            Tell us about your capital and broker. We&rsquo;ll review whether this tier fits, with no obligation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/contact?algo=${s.config.slug}`} className="btn btn-gold">
              Request evaluation <ArrowRight size={14} />
            </Link>
            <Link href="/algos" className="btn btn-ghost-light">
              All strategies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
