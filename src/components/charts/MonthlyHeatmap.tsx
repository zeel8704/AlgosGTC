'use client';

import { useMemo } from 'react';
import type { MonthlyReturn } from '@/types';
import { formatMonthName } from '@/lib/formatters';

interface MonthlyHeatmapProps {
  data: MonthlyReturn[];
}

export function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
  const { years, grid } = useMemo(() => {
    if (!data.length) return { years: [], grid: new Map() };

    const yrs = [...new Set(data.map((d) => d.year))].sort();
    const g = new Map<string, MonthlyReturn>();
    data.forEach((d) => {
      g.set(`${d.year}-${d.month}`, d);
    });
    return { years: yrs, grid: g };
  }, [data]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">Monthly return data not yet available.</p>
      </div>
    );
  }

  const getColor = (ret: number) => {
    if (ret > 10) return 'heatmap-strong-positive';
    if (ret > 0) return 'heatmap-positive';
    if (ret === 0) return 'heatmap-neutral';
    if (ret > -10) return 'heatmap-negative';
    return 'heatmap-strong-negative';
  };

  // Yearly totals
  const yearlyReturns = years.map((yr) => {
    const monthsData = Array.from({ length: 12 }, (_, i) => grid.get(`${yr}-${i + 1}`));
    const total = monthsData.reduce((sum, m) => sum + (m?.pnl || 0), 0);
    return { year: yr, total };
  });

  return (
    <div className="table-scroll">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-2 text-[10px] text-[var(--text-muted)] uppercase tracking-wider text-left">
              Year
            </th>
            {Array.from({ length: 12 }, (_, i) => (
              <th key={i} className="py-2 px-1 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                {formatMonthName(i + 1)}
              </th>
            ))}
            <th className="py-2 px-2 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Year
            </th>
          </tr>
        </thead>
        <tbody>
          {years.map((yr, yi) => (
            <tr key={yr}>
              <td className="py-1 px-2 text-xs font-semibold text-[var(--text-secondary)] text-left">
                {yr}
              </td>
              {Array.from({ length: 12 }, (_, i) => {
                const m = grid.get(`${yr}-${i + 1}`);
                if (!m) {
                  return (
                    <td key={i} className="py-1 px-1">
                      <div className="w-full h-8 rounded bg-[var(--bg-tertiary)]" />
                    </td>
                  );
                }
                return (
                  <td key={i} className="py-1 px-1">
                    <div
                      className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-mono font-semibold ${getColor(m.returnPct)}`}
                      title={`${formatMonthName(m.month)} ${m.year}: ${m.returnPct > 0 ? '+' : ''}${m.returnPct.toFixed(1)}% (${m.pnl.toLocaleString('en-US')} USC)`}
                    >
                      {m.returnPct > 0 ? '+' : ''}{m.returnPct.toFixed(1)}%
                    </div>
                  </td>
                );
              })}
              <td className="py-1 px-2">
                <div className={`text-xs font-mono font-bold ${yearlyReturns[yi].total > 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                  {(yearlyReturns[yi].total / 1000).toFixed(1)}K
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
