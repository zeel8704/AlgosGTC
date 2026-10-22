'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { EquityPoint } from '@/types';
import { formatCurrency, formatMonthYear } from '@/lib/formatters';

interface EquityCurveChartProps {
  data: EquityPoint[];
  adjustedData?: EquityPoint[];
  showAdjusted?: boolean;
  normalized?: boolean;
  color?: string;
  adjustedColor?: string;
  label?: string;
  adjustedLabel?: string;
  height?: number;
}

export function EquityCurveChart({
  data,
  adjustedData,
  showAdjusted = false,
  normalized = false,
  color = '#c8a853',
  adjustedColor = '#34d399',
  label = 'Balance',
  adjustedLabel = 'Adjusted',
  height = 360,
}: EquityCurveChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return [];

    const baseVal = data[0]?.balance || 1;
    const adjBaseVal = adjustedData?.[0]?.balance || 1;

    // Merge original and adjusted by date
    const dateMap = new Map<string, Record<string, number>>();

    data.forEach((pt) => {
      const val = normalized ? (pt.balance / baseVal) * 100 : pt.balance;
      dateMap.set(pt.date, { ...dateMap.get(pt.date), original: val });
    });

    if (showAdjusted && adjustedData) {
      adjustedData.forEach((pt) => {
        const val = normalized ? (pt.balance / adjBaseVal) * 100 : pt.balance;
        const existing = dateMap.get(pt.date) || {};
        dateMap.set(pt.date, { ...existing, adjusted: val });
      });
    }

    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({
        date,
        displayDate: formatMonthYear(date),
        ...vals,
      }));
  }, [data, adjustedData, showAdjusted, normalized]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">
          Equity curve data not yet available. Processing backtest reports...
        </p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 168, 83, 0.08)" />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#5a6478', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(200, 168, 83, 0.12)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#5a6478', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(200, 168, 83, 0.12)' }}
            tickFormatter={(v) => normalized ? `${v.toFixed(0)}%` : formatCurrency(v, { compact: true })}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: '#0f1628',
              border: '1px solid rgba(200, 168, 83, 0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e8e6e1',
            }}
            labelStyle={{ color: '#8b95a8' }}
            formatter={(value, name) => {
              const v = Number(value);
              return [
                normalized ? `${v.toFixed(2)}%` : formatCurrency(v),
                name === 'original' ? label : adjustedLabel,
              ];
            }}
          />
          {showAdjusted && <Legend wrapperStyle={{ fontSize: '12px', color: '#8b95a8' }} />}
          <Line
            type="monotone"
            dataKey="original"
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
          {showAdjusted && (
            <Line
              type="monotone"
              dataKey="adjusted"
              name={adjustedLabel}
              stroke={adjustedColor}
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 3"
              activeDot={{ r: 4, fill: adjustedColor }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
