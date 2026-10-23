'use client';

import { useId, useState } from 'react';
import { Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  tooltip?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricCard({ label, value, tooltip, trend, size = 'md', className = '' }: MetricCardProps) {
  const [open, setOpen] = useState(false);
  const tipId = useId();

  const valueCls = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-semibold',
    lg: 'font-display text-[34px] leading-none',
  }[size];

  const trendColor =
    trend === 'positive' ? 'text-positive' : trend === 'negative' ? 'text-negative' : 'text-ink';

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="label">{label}</span>
        {tooltip && (
          <span className="relative inline-flex">
            <button
              type="button"
              aria-label={`About ${label}`}
              aria-describedby={open ? tipId : undefined}
              className="text-ink-3 hover:text-gold-deep transition-colors"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            >
              <Info size={12} />
            </button>
            {open && (
              <span
                id={tipId}
                role="tooltip"
                className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-[4px] bg-espresso px-3 py-2.5 text-xs leading-relaxed text-on-dark shadow-xl"
              >
                {tooltip}
              </span>
            )}
          </span>
        )}
      </div>
      <div className={`tnum tracking-tight ${valueCls} ${trendColor}`}>{value}</div>
    </div>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
}

export function MetricGrid({ children, columns = 4 }: MetricGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  }[columns];

  return <div className={`grid ${gridCols} gap-x-8 gap-y-9`}>{children}</div>;
}
