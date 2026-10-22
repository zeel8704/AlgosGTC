import Link from 'next/link';
import type { StrategyData } from '@/types';
import { EquityCurveChart } from '@/components/charts/EquityCurveChart';
import { MonthlyHeatmap } from '@/components/charts/MonthlyHeatmap';
import { MetricCard, MetricGrid } from '@/components/MetricCard';
import {
  formatCurrency, formatPercentUnsigned, formatRatio, formatInteger,
} from '@/lib/formatters';
import {
  TrendingUp, Mail, Calendar, Server, Layers,
} from 'lucide-react';

export function AlgoDetail({ strategy: s }: { strategy: StrategyData }) {
  const m = s.originalMetrics;
  const monthly = s.monthlyReturns;
  const cap = s.config.capitalRequirement;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <Link href="/algos" className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)]">← All strategies</Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2">{s.config.name}</h1>
          <p className="text-[var(--text-secondary)] mt-1">{s.config.tagline}</p>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[var(--gold-muted)] text-[var(--gold)] font-medium">{s.config.platform.symbol}</span>
            <span className="px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{s.config.strategyFamily}</span>
            <span className="px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{s.config.direction}</span>
          </div>
        </div>
      </div>

      {/* ── Overview ───────────────────────────── */}
      <div className="card card-inner mb-8">
        <p className="text-[var(--text-secondary)] leading-relaxed">{s.config.description}</p>
      </div>

      {/* ── Key metrics ────────────────────────── */}
      <section className="mb-8">
        <div className="card card-inner">
          <MetricGrid columns={4}>
            <MetricCard label="CAGR" value={formatPercentUnsigned(m.cagr)} trend="positive" tooltip="Compound annual growth rate over the test period, from initial to final balance." />
            <MetricCard label="Net Profit" value={formatCurrency(m.totalNetProfit, { compact: true })} trend="positive" tooltip="Total realized profit in account currency (USC)." />
            <MetricCard label="Max Balance DD" value={formatPercentUnsigned(m.maxDrawdownPct)} trend="negative" tooltip="Largest peak-to-trough decline of the realized balance curve (deal level)." />
            <MetricCard label="Max Equity DD" value={formatPercentUnsigned(m.equityDDMaxPct)} trend="negative" tooltip="Largest floating (unrealized) drawdown of account equity — the true downside of this type of system. Report-only figure." />
            <MetricCard label="Profit Factor" value={formatRatio(m.profitFactor)} tooltip="Gross profit divided by gross loss." />
            <MetricCard label="MAR Ratio" value={formatRatio(m.marRatio)} tooltip="CAGR divided by max balance drawdown %. Higher is better risk-adjusted return." />
            <MetricCard label="Win Rate" value={formatPercentUnsigned(m.winRate)} tooltip="Share of closed trades that were profitable." />
            <MetricCard label="Total Trades" value={formatInteger(m.totalTrades)} tooltip="Closed round-trip trades (exit deals)." />
          </MetricGrid>
        </div>
      </section>

      {/* ── Equity curve ───────────────────────── */}
      <section className="card card-inner mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--gold)]" /> Equity curve
          </h2>
          <span className="text-xs text-[var(--text-muted)]">Balance (USC)</span>
        </div>
        <EquityCurveChart
          data={s.equityCurve}
          label="Balance (USC)"
          height={380}
        />
        <p className="text-[10px] text-[var(--text-muted)] mt-2">
          End-of-day account balance from the MT5 Deals ledger — the realized balance curve. Intraday floating equity is not shown here.
        </p>
      </section>

      {/* ── Monthly returns ────────────────────── */}
      <section className="card card-inner mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Monthly returns</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          % of start-of-month balance.
        </p>
        <MonthlyHeatmap data={monthly} />
      </section>

      {/* ── Trade statistics ───────────────────── */}
      <section className="card card-inner mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <Layers size={18} className="text-[var(--gold)]" /> Trade statistics
        </h2>
        <MetricGrid columns={4}>
          <MetricCard label="Gross Profit" value={formatCurrency(m.grossProfit, { compact: true })} trend="positive" />
          <MetricCard label="Gross Loss" value={formatCurrency(m.grossLoss, { compact: true })} trend="negative" />
          <MetricCard label="Winning Trades" value={formatInteger(m.winningTrades)} />
          <MetricCard label="Losing Trades" value={formatInteger(m.losingTrades)} />
          <MetricCard label="Avg Win" value={formatCurrency(m.avgProfitTrade)} trend="positive" />
          <MetricCard label="Avg Loss" value={formatCurrency(m.avgLossTrade)} trend="negative" />
          <MetricCard label="Best Trade" value={formatCurrency(m.largestProfitTrade, { compact: true })} trend="positive" />
          <MetricCard label="Worst Trade" value={formatCurrency(m.largestLossTrade, { compact: true })} trend="negative" />
          <MetricCard label="Expected Payoff" value={formatCurrency(m.expectedPayoff)} tooltip="Average net result per closed trade." />
          <MetricCard label="Recovery Factor" value={formatRatio(m.recoveryFactor)} tooltip="Net profit divided by max balance drawdown." />
          <MetricCard label="Avg Hold Time" value={m.avgHoldTime} tooltip="Average time a position was held open (report-only)." />
          <MetricCard label="Sharpe Ratio" value={formatRatio(m.sharpeRatio)} tooltip="Report-only risk-adjusted return." />
        </MetricGrid>
      </section>

      {/* ── Backtest details + capital ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="card card-inner">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-[var(--gold)]" /> Backtest details
          </h2>
          <dl className="space-y-3 text-sm">
            {[
              ['Test period', `${s.config.testPeriod.startDate} → ${s.config.testPeriod.endDate}`],
              ['Span', `${s.config.testPeriod.spanYears} years`],
              ['History quality', s.config.testPeriod.historyQuality],
              ['Type', 'Historical backtest (MT5 Strategy Tester)'],
              ['Forward test', 'Not yet available'],
              ['Symbol', s.config.platform.symbol],
              ['Timeframe', s.config.platform.timeframe],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-[var(--border)] pb-2 last:border-0">
                <dt className="text-[var(--text-secondary)]">{k}</dt>
                <dd className="text-[var(--text-primary)] font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card card-inner">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <Server size={18} className="text-[var(--gold)]" /> Capital &amp; platform
          </h2>
          <dl className="space-y-3 text-sm">
            {[
              ['Tested balance', `${formatCurrency(cap.minimumUSD, { decimals: 0 })} (${cap.minimumINR})`],
              ['Account type', 'Cent account (USC · 100 USC = 1 USD)'],
              ['Leverage', cap.leverage],
              ['Broker', s.config.platform.broker],
              ['Platform', s.config.platform.platform],
              ['EA version', s.reportMeta.version],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-[var(--border)] pb-2 last:border-0">
                <dt className="text-[var(--text-secondary)]">{k}</dt>
                <dd className="text-[var(--text-primary)] font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
          {cap.note && <p className="text-[10px] text-[var(--text-muted)] mt-3 leading-relaxed">{cap.note}</p>}
        </section>
      </div>

      {/* ── CTA ────────────────────────────────── */}
      <section className="card card-inner text-center py-10">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Evaluate {s.config.name}</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
          Request an evaluation to review suitability for your capital and risk tolerance.
        </p>
        <Link href={`/contact?algo=${s.config.slug}`} className="btn-primary">
          <Mail size={16} /> Request an Algo Evaluation
        </Link>
      </section>
    </div>
  );
}
