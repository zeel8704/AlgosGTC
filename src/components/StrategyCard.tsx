import Link from 'next/link';
import type { StrategyData } from '@/types';
import { formatCurrency, formatPercentUnsigned, formatRatio, formatInteger } from '@/lib/formatters';
import { ArrowRight, TrendingUp, Shield, BarChart3 } from 'lucide-react';

interface StrategyCardProps {
  strategy: StrategyData;
  variant?: 'compact' | 'full';
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const { config, originalMetrics: m } = strategy;
  const href = `/algos/${config.slug}`;

  const tierColors: Record<string, string> = {
    Standard: 'from-amber-500/20 to-amber-600/5',
    Mini: 'from-sky-500/20 to-sky-600/5',
    Micro: 'from-emerald-500/20 to-emerald-600/5',
  };

  const tierAccent: Record<string, string> = {
    Standard: '#f59e0b',
    Mini: '#38bdf8',
    Micro: '#34d399',
  };

  const accent = tierAccent[config.shortName] ?? 'var(--gold)';
  const gradient = tierColors[config.shortName] ?? 'from-amber-500/20 to-amber-600/5';

  return (
    <div className="card group">
      {/* Accent bar */}
      <div className="h-1 rounded-t-xl" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

      <div className="card-inner">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{config.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {config.platform.symbol} · {config.platform.platform}
            </p>
          </div>
          <div
            className="px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{ background: `${accent}20`, color: accent }}
            title={`Tested on a ${config.capitalRequirement.minimumUSD.toLocaleString('en-US')} USC cent account`}
          >
            {config.capitalRequirement.minimumINR} · {config.direction}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-[var(--positive)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">CAGR</span>
            </div>
            <span className="font-mono text-base font-semibold text-[var(--positive)]">
              {formatPercentUnsigned(m.cagr)}
            </span>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield size={12} className="text-[var(--negative)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Max DD</span>
            </div>
            <span className="font-mono text-base font-semibold text-[var(--negative)]">
              {formatPercentUnsigned(m.maxDrawdownPct)}
            </span>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 size={12} className="text-[var(--gold)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Profit Factor</span>
            </div>
            <span className="font-mono text-base font-semibold text-[var(--text-primary)]">
              {formatRatio(m.profitFactor)}
            </span>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-[var(--gold)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Trades</span>
            </div>
            <span className="font-mono text-base font-semibold text-[var(--text-primary)]">
              {formatInteger(m.totalTrades)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">
            {config.testPeriod.startDate} — {config.testPeriod.endDate}
          </span>
          <Link href={href} className="flex items-center gap-1 text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
