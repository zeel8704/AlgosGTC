'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { EquityPoint } from '@/types';
import { THEME } from '@/config/brand';
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/formatters';

interface EquityCurveChartProps {
  data: EquityPoint[];
  label?: string;
  height?: number;
}

const C = THEME.colors;

interface TooltipPayload {
  active?: boolean;
  payload?: { value: number; payload: { date: string } }[];
}

function ChartTooltip({ active, payload, seriesName }: TooltipPayload & { seriesName: string }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div className="rounded-[4px] bg-espresso px-3.5 py-2.5 shadow-xl">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-dark-2">
        {formatDate(point.payload.date)}
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-on-dark tnum">
        <span className="h-2 w-2 rounded-full" style={{ background: C.goldSoft }} />
        <span className="text-on-dark-2">{seriesName}</span>
        <span className="font-semibold">{formatCurrency(point.value)}</span>
      </div>
    </div>
  );
}

export function EquityCurveChart({ data, label = 'Balance', height = 360 }: EquityCurveChartProps) {
  const chartData = useMemo(
    () =>
      [...data]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((pt) => ({ date: pt.date, displayDate: formatMonthYear(pt.date), balance: pt.balance })),
    [data],
  );

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 rounded-[4px] border border-dashed border-line-strong bg-sand/50">
        <p className="text-sm text-ink-3">Balance history is not available for this strategy.</p>
      </div>
    );
  }

  return (
    <div style={{ height }} role="img" aria-label={`${label} over the backtest period`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.gold} stopOpacity={0.24} />
              <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={C.line} strokeDasharray="0" />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: C.ink3, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: C.lineStrong }}
            interval="preserveStartEnd"
            minTickGap={48}
            tickMargin={10}
          />
          <YAxis
            tick={{ fill: C.ink3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCurrency(v, { compact: true }).replace(' USC', '')}
            width={56}
            tickMargin={6}
          />
          <Tooltip
            content={<ChartTooltip seriesName={label} />}
            cursor={{ stroke: C.ink3, strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name={label}
            stroke={C.goldDeep}
            strokeWidth={2}
            fill="url(#equity-fill)"
            dot={false}
            activeDot={{ r: 5, fill: C.goldDeep, stroke: C.ivory, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
