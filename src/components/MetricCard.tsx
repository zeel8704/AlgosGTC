'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  tooltip?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricCard({ label, value, tooltip, trend, size = 'md', className = '' }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const valueSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const trendColor = trend === 'positive'
    ? 'text-[var(--positive)]'
    : trend === 'negative'
    ? 'text-[var(--negative)]'
    : 'text-[var(--text-primary)]';

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className="metric-label">{label}</span>
        {tooltip && (
          <div className="relative inline-block">
            <Info
              size={12}
              className="text-[var(--text-muted)] cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)] w-48 shadow-lg">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={`font-mono font-semibold ${valueSize} ${trendColor} tracking-tight`}>
        {value}
      </div>
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

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
      {children}
    </div>
  );
}
