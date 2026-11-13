'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';

interface MetricCardProps {
  /** Plain-language name shown to the reader. */
  label: string;
  value: string;
  /** Conventional name, shown at the top of the tooltip. */
  technical?: string;
  /** Plain explanation shown in the tooltip. */
  tooltip?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Tooltip opens on hover and keyboard focus, and toggles on tap for touch screens.
export function MetricCard({ label, value, technical, tooltip, trend, size = 'md', className = '' }: MetricCardProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const tipId = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) { setPinned(false); setOpen(false); }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPinned(false); setOpen(false); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [pinned]);

  const valueCls = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-semibold',
    lg: 'font-display text-[34px] leading-none',
  }[size];

  const trendColor =
    trend === 'positive' ? 'text-positive' : trend === 'negative' ? 'text-negative' : 'text-ink';

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-start gap-1.5 mb-2.5">
        <span className="label leading-snug">{label}</span>
        {tooltip && (
          <span ref={wrap} className="relative inline-flex shrink-0 mt-px">
            <button
              type="button"
              aria-label={`What does ${label} mean?`}
              aria-expanded={open}
              aria-describedby={open ? tipId : undefined}
              className="text-ink-3 hover:text-gold-deep transition-colors"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => { if (!pinned) setOpen(false); }}
              onFocus={() => setOpen(true)}
              onBlur={() => { if (!pinned) setOpen(false); }}
              onClick={() => { const next = !pinned; setPinned(next); setOpen(next || true); }}
            >
              <Info size={13} />
            </button>
            {open && (
              <span
                id={tipId}
                role="tooltip"
                className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-[4px] bg-espresso px-3.5 py-3 text-left text-xs leading-relaxed text-on-dark shadow-xl"
              >
                {technical && technical !== label && (
                  <span className="block mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
                    {technical}
                  </span>
                )}
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
