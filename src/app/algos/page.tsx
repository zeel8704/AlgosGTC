import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { formatCurrency, formatPercentUnsigned, formatRatio } from '@/lib/formatters';
import { BRAND, CENT_ACCOUNT_NOTE } from '@/config/brand';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `Algo Portfolio — ${BRAND.name}`,
  description: 'Three XAUUSD algorithmic strategies with documented backtest performance, risk metrics and capital requirements.',
};

export default function AlgosPage() {
  const strategies = getAllStrategies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="text-xs font-medium text-[var(--gold)] uppercase tracking-wider mb-3">Algo Portfolio</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
          Three systematic XAUUSD strategies
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Each algorithm is an independent MetaTrader 5 Expert Advisor, backtested on 100% real tick
          data over the same ~2.7-year window. They share a common systematic approach but differ in
          direction, risk and the account size they were tested at. Every figure below is taken from, or
          reconciled to, the source Strategy Tester reports.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {strategies.map((s) => (
          <StrategyCard key={s.config.id} strategy={s} />
        ))}
      </div>

      {/* Capital comparison */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Capital requirements</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">{CENT_ACCOUNT_NOTE}</p>
        <div className="card card-inner table-scroll">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Strategy</th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Tested balance</th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Label</th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Direction</th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Leverage</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((s) => (
                <tr key={s.config.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="py-4 px-4">
                    <Link href={`/algos/${s.config.slug}`} className="font-semibold text-[var(--text-primary)] hover:text-[var(--gold)]">
                      {s.config.name}
                    </Link>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-[var(--text-primary)]">{formatCurrency(s.config.capitalRequirement.minimumUSD, { decimals: 0 })}</td>
                  <td className="py-4 px-4 font-mono text-sm text-[var(--gold)]">{s.config.capitalRequirement.minimumINR}</td>
                  <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{s.config.direction}</td>
                  <td className="py-4 px-4 font-mono text-sm text-[var(--text-secondary)]">{s.config.capitalRequirement.leverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-3">
          Different cent-account balances are not directly comparable as &ldquo;cost&rdquo;; they are the balances each
          system was tested at.
        </p>
      </section>

      {/* Full comparison */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Head-to-head metrics</h2>
        <div className="card card-inner">
          <ComparisonTable strategies={strategies} />
        </div>
      </section>

      {/* Quick performance snapshot */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">At a glance (as-tested)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((s) => (
            <div key={s.config.id} className="card card-inner">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{s.config.name}</h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['CAGR', formatPercentUnsigned(s.originalMetrics.cagr), 'text-[var(--positive)]'],
                  ['Net profit', formatCurrency(s.originalMetrics.totalNetProfit, { compact: true }), 'text-[var(--positive)]'],
                  ['Max balance DD', formatPercentUnsigned(s.originalMetrics.maxDrawdownPct), 'text-[var(--negative)]'],
                  ['Max equity DD', formatPercentUnsigned(s.originalMetrics.equityDDMaxPct), 'text-[var(--negative)]'],
                  ['Profit factor', formatRatio(s.originalMetrics.profitFactor), 'text-[var(--text-primary)]'],
                  ['MAR ratio', formatRatio(s.originalMetrics.marRatio), 'text-[var(--text-primary)]'],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-[var(--text-secondary)]">{label}</dt>
                    <dd className={`font-mono font-medium ${color}`}>{value}</dd>
                  </div>
                ))}
              </dl>
              <Link href={`/algos/${s.config.slug}`} className="btn-secondary w-full justify-center mt-5 text-sm">
                Full performance <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
