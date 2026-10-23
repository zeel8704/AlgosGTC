'use client';

import { useMemo } from 'react';
import type { MonthlyReturn } from '@/types';
import { formatMonthName } from '@/lib/formatters';

interface MonthlyHeatmapProps {
  data: MonthlyReturn[];
}

// Sequential teak ramp for gains (light → dark), terracotta for losses.
// Every step keeps ink text ≥ 6:1, so values never rely on the fill.
const POSITIVE_STEPS = [
  { max: 2.5, bg: '#F3E7CD' },
  { max: 5, bg: '#E9D3A3' },
  { max: 8, bg: '#DDBC78' },
  { max: Infinity, bg: '#CFA455' },
];
const NEGATIVE_STEPS = [
  { min: -5, bg: '#F2D9CF' },
  { min: -Infinity, bg: '#E2B3A2' },
];

function cellColor(ret: number) {
  if (ret > 0) return POSITIVE_STEPS.find((s) => ret <= s.max)!.bg;
  if (ret < 0) return NEGATIVE_STEPS.find((s) => ret >= s.min)!.bg;
  return '#EDE3D3';
}

export function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
  const { years, grid } = useMemo(() => {
    const yrs = [...new Set(data.map((d) => d.year))].sort();
    const g = new Map<string, MonthlyReturn>();
    data.forEach((d) => g.set(`${d.year}-${d.month}`, d));
    return { years: yrs, grid: g };
  }, [data]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 rounded-[4px] border border-dashed border-line-strong bg-sand/50">
        <p className="text-sm text-ink-3">Monthly return data is not available.</p>
      </div>
    );
  }

  const yearlyPnl = years.map((yr) =>
    Array.from({ length: 12 }, (_, i) => grid.get(`${yr}-${i + 1}`)?.pnl ?? 0).reduce((a, b) => a + b, 0),
  );

  return (
    <div>
      <div className="table-scroll -mx-1 px-1">
        <table className="w-full min-w-[720px] border-separate border-spacing-[3px] text-center">
          <caption className="sr-only">Monthly returns as a percentage of start-of-month balance</caption>
          <thead>
            <tr>
              <th scope="col" className="label text-[10px] text-left pb-2 pr-3 font-semibold">Year</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} scope="col" className="label text-[10px] pb-2 font-semibold tracking-[0.1em]">
                  {formatMonthName(i + 1)}
                </th>
              ))}
              <th scope="col" className="label text-[10px] text-right pb-2 pl-3 font-semibold">Year P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {years.map((yr, yi) => (
              <tr key={yr}>
                <th scope="row" className="text-left pr-3 font-display text-base font-medium text-ink">
                  {yr}
                </th>
                {Array.from({ length: 12 }, (_, i) => {
                  const m = grid.get(`${yr}-${i + 1}`);
                  if (!m) {
                    return (
                      <td key={i} className="h-10 rounded-[3px] border border-dashed border-line" aria-label="No data" />
                    );
                  }
                  const sign = m.returnPct > 0 ? '+' : '';
                  return (
                    <td
                      key={i}
                      className="h-10 rounded-[3px] text-[11px] font-semibold tnum text-ink transition-[filter] hover:brightness-95"
                      style={{ background: cellColor(m.returnPct) }}
                      title={`${formatMonthName(m.month)} ${m.year}: ${sign}${m.returnPct.toFixed(1)}% (${m.pnl.toLocaleString(
                        'en-US',
                      )} USC)`}
                    >
                      {sign}
                      {m.returnPct.toFixed(1)}%
                    </td>
                  );
                })}
                <td className="pl-3 text-right text-xs font-semibold tnum text-ink whitespace-nowrap">
                  {(yearlyPnl[yi] / 1000).toFixed(1)}K
                  <span className="ml-1 font-normal text-ink-3">USC</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-ink-3">
        <div className="flex items-center gap-2">
          <span>Loss</span>
          {[...NEGATIVE_STEPS].reverse().map((s) => (
            <span key={s.bg} className="h-3 w-6 rounded-[2px]" style={{ background: s.bg }} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span>Gain</span>
          {POSITIVE_STEPS.map((s) => (
            <span key={s.bg} className="h-3 w-6 rounded-[2px]" style={{ background: s.bg }} />
          ))}
          <span>stronger</span>
        </div>
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded-[2px] border border-dashed border-line-strong" /> No trading data
        </span>
      </div>
    </div>
  );
}
