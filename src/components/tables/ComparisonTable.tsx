'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { StrategyData, PerformanceMetrics } from '@/types';
import { COMPARISON_METRICS, DEFAULT_COMPARISON_KEYS } from '@/lib/metrics';
import { formatMetric } from '@/lib/formatters';
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronsUpDown, SlidersHorizontal, Check } from 'lucide-react';

interface ComparisonTableProps {
  strategies: StrategyData[];
}

const value = (s: StrategyData, key: string) => s.originalMetrics[key as keyof PerformanceMetrics];

export function ComparisonTable({ strategies }: ComparisonTableProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(DEFAULT_COMPARISON_KEYS);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showPicker, setShowPicker] = useState(false);

  const visibleMetrics = COMPARISON_METRICS.filter((m) => selectedMetrics.includes(m.key));

  const sorted = [...strategies].sort((a, b) => {
    if (!sortKey) return 0;
    const av = value(a, sortKey);
    const bv = value(b, sortKey);
    if (typeof av !== 'number' || typeof bv !== 'number') return 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  // Best value per column, for metrics with a clear direction.
  const best = useMemo(() => {
    const out: Record<string, string> = {};
    for (const m of COMPARISON_METRICS) {
      if (m.higherIsBetter === undefined) continue;
      let winner: StrategyData | null = null;
      for (const s of strategies) {
        const v = value(s, m.key);
        if (typeof v !== 'number') continue;
        const w = winner ? value(winner, m.key) : null;
        if (typeof w !== 'number' || (m.higherIsBetter ? v > w : v < w)) winner = s;
      }
      if (winner) out[m.key] = winner.config.id;
    }
    return out;
  }, [strategies]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      const metric = COMPARISON_METRICS.find((m) => m.key === key);
      setSortDir(metric?.higherIsBetter === false ? 'asc' : 'desc');
    }
  };

  const toggleMetric = (key: string) =>
    setSelectedMetrics((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-xs text-ink-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          Marks the strongest figure in each column. Select a column header to sort.
        </p>
        <button
          onClick={() => setShowPicker((v) => !v)}
          aria-expanded={showPicker}
          className="inline-flex items-center gap-2 rounded-[2px] border border-line-strong px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-2 hover:border-ink hover:text-ink transition-colors"
        >
          <SlidersHorizontal size={13} /> Columns
        </button>
      </div>

      {showPicker && (
        <div className="mb-5 rounded-[4px] border border-line bg-sand/50 p-4">
          <p className="label mb-3">Show metrics</p>
          <div className="flex flex-wrap gap-2">
            {COMPARISON_METRICS.map((m) => {
              const on = selectedMetrics.includes(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    on ? 'border-ink bg-ink text-on-dark' : 'border-line-strong bg-ivory text-ink-2 hover:border-ink-2'
                  }`}
                >
                  {on && <Check size={12} />}
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="table-scroll">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ink/80">
              <th scope="col" className="sticky left-0 z-10 bg-ivory py-3 pr-4 text-left label text-[10px]">
                Strategy
              </th>
              {visibleMetrics.map((m) => {
                const active = sortKey === m.key;
                return (
                  <th
                    key={m.key}
                    scope="col"
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className="py-3 px-3 text-right whitespace-nowrap"
                  >
                    <button
                      onClick={() => handleSort(m.key)}
                      title={m.description}
                      className={`inline-flex items-center gap-1 label text-[10px] tracking-[0.1em] hover:text-ink transition-colors ${
                        active ? 'text-ink' : ''
                      }`}
                    >
                      {m.label}
                      {active ? (
                        sortDir === 'desc' ? <ArrowDown size={11} /> : <ArrowUp size={11} />
                      ) : (
                        <ChevronsUpDown size={11} className="opacity-40" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="py-3 px-3 text-right label text-[10px] tracking-[0.1em] whitespace-nowrap">Capital</th>
              <th scope="col" className="py-3 pl-2"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.config.id} className="group border-b border-line hover:bg-sand/40 transition-colors">
                <th scope="row" className="sticky left-0 z-10 bg-ivory group-hover:bg-[#F6F0E6] py-5 pr-4 text-left font-normal transition-colors">
                  <Link href={`/algos/${s.config.slug}`} className="font-display text-lg text-ink hover:text-gold-deep transition-colors whitespace-nowrap">
                    {s.config.name}
                  </Link>
                  <div className="mt-0.5 text-[11px] text-ink-3 whitespace-nowrap">{s.config.direction}</div>
                </th>
                {visibleMetrics.map((m) => {
                  const v = value(s, m.key);
                  const isBest = best[m.key] === s.config.id;
                  return (
                    <td key={m.key} className="py-5 px-3 text-right text-sm tnum text-ink whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        {isBest && (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                            <span className="sr-only">Best: </span>
                          </>
                        )}
                        <span className={isBest ? 'font-semibold' : ''}>{formatMetric(v as number, m.format)}</span>
                      </span>
                    </td>
                  );
                })}
                <td className="py-5 px-3 text-right whitespace-nowrap">
                  <div className="font-display text-lg text-gold-deep leading-none">{s.config.capitalRequirement.minimumINR}</div>
                  <div className="mt-1 text-[11px] text-ink-3 tnum">
                    {s.config.capitalRequirement.minimumUSD.toLocaleString('en-US')} USC
                  </div>
                </td>
                <td className="py-5 pl-2 text-right">
                  <Link
                    href={`/algos/${s.config.slug}`}
                    aria-label={`Open ${s.config.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-ink-2 hover:border-ink hover:bg-ink hover:text-on-dark transition-colors"
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11px] text-ink-3 leading-relaxed">
        All figures are as-tested from MT5 Strategy Tester reports. Capital is the tested cent-account balance (USC),
        shown with its lakh-size label; 100 USC = 1 USD.
      </p>
    </div>
  );
}
