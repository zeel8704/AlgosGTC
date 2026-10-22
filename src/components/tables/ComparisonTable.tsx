'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { StrategyData, PerformanceMetrics } from '@/types';
import { COMPARISON_METRICS, DEFAULT_COMPARISON_KEYS } from '@/lib/metrics';
import { formatMetric } from '@/lib/formatters';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Info, Settings2 } from 'lucide-react';

interface ComparisonTableProps {
  strategies: StrategyData[];
}

export function ComparisonTable({ strategies }: ComparisonTableProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(DEFAULT_COMPARISON_KEYS);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showMetricPicker, setShowMetricPicker] = useState(false);
  const [tooltipMetric, setTooltipMetric] = useState<string | null>(null);

  const visibleMetrics = COMPARISON_METRICS.filter((m) => selectedMetrics.includes(m.key));

  // Sort strategies
  const sorted = [...strategies].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a.originalMetrics[sortKey as keyof PerformanceMetrics];
    const bVal = b.originalMetrics[sortKey as keyof PerformanceMetrics];
    if (typeof aVal !== 'number' || typeof bVal !== 'number') return 0;
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      const metric = COMPARISON_METRICS.find((m) => m.key === key);
      setSortDir(metric?.higherIsBetter === false ? 'asc' : 'desc');
    }
  };

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div>
      {/* Metric picker toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Strategy Comparison</h3>
        <button
          onClick={() => setShowMetricPicker(!showMetricPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] border border-[var(--border)] transition-colors"
        >
          <Settings2 size={14} /> Customize Metrics
        </button>
      </div>

      {/* Metric picker */}
      {showMetricPicker && (
        <div className="mb-4 p-4 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl">
          <p className="text-xs text-[var(--text-muted)] mb-3">Select metrics to display:</p>
          <div className="flex flex-wrap gap-2">
            {COMPARISON_METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedMetrics.includes(m.key)
                    ? 'bg-[var(--gold-muted)] text-[var(--gold)] border border-[var(--gold)]'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-scroll">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sticky left-0 bg-[var(--bg-card)] z-10">
                Algorithm
              </th>
              {visibleMetrics.map((m) => (
                <th
                  key={m.key}
                  className="text-right py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--gold)] transition-colors whitespace-nowrap"
                  onClick={() => handleSort(m.key)}
                >
                  <div className="flex items-center justify-end gap-1 relative"
                    onMouseEnter={() => setTooltipMetric(m.key)}
                    onMouseLeave={() => setTooltipMetric(null)}
                  >
                    <Info size={10} className="text-[var(--text-muted)] opacity-50" />
                    {m.label}
                    {sortKey === m.key ? (
                      sortDir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-30" />
                    )}
                    {tooltipMetric === m.key && (
                      <div className="absolute z-50 top-full right-0 mt-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[10px] text-[var(--text-secondary)] w-44 shadow-lg font-normal normal-case tracking-normal">
                        {m.description}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Capital
              </th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.config.id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <td className="py-4 px-4 sticky left-0 bg-[var(--bg-card)] group-hover:bg-[var(--bg-card-hover)] z-10">
                  <Link href={`/algos/${s.config.slug}`} className="font-semibold text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors">
                    {s.config.name}
                  </Link>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {s.config.platform.symbol} · {s.config.testPeriod.type}
                  </p>
                </td>
                {visibleMetrics.map((m) => {
                  const val = s.originalMetrics[m.key as keyof PerformanceMetrics];
                  const formatted = formatMetric(val as number, m.format);
                  let color = 'text-[var(--text-primary)]';
                  if (m.key === 'maxDrawdownPct' || m.key === 'maxDrawdownAbs' || m.key === 'grossLoss' || m.key === 'largestLossTrade') {
                    color = 'text-[var(--negative)]';
                  } else if (m.key === 'cagr' || m.key === 'totalNetProfit') {
                    color = typeof val === 'number' && val > 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]';
                  }
                  return (
                    <td key={m.key} className={`text-right py-4 px-4 font-mono text-sm font-medium ${color}`}>
                      {formatted}
                    </td>
                  );
                })}
                <td className="text-right py-4 px-4 text-sm font-medium text-[var(--text-primary)]">
                  <div className="font-mono">{s.config.capitalRequirement.minimumINR}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {s.config.capitalRequirement.minimumUSD.toLocaleString('en-US')} USC
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Link href={`/algos/${s.config.slug}`} className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">
                    <ExternalLink size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-[var(--text-muted)] mt-3">
        All metrics are from historical MT5 backtest reports (as-tested). Click column headers to sort.
        Capital is the tested cent-account balance, shown in account currency (USC) with a lakh-size label. 100 USC = 1 USD.
      </p>
    </div>
  );
}
