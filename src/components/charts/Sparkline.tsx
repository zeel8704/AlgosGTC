import type { EquityPoint } from '@/types';
import { THEME } from '@/config/brand';
import { formatCurrency } from '@/lib/formatters';

interface SparklineProps {
  data: EquityPoint[];
  /** Unique per instance on a page; used for the gradient id. */
  id: string;
  name: string;
  tone?: 'light' | 'dark';
  className?: string;
  animate?: boolean;
}

const W = 240;
const H = 64;
const PAD = 3;

// Small, server-rendered balance curve. Single series, no axes: the card it sits in names it.
export function Sparkline({ data, id, name, tone = 'light', className = '', animate = true }: SparklineProps) {
  if (data.length < 2) return null;

  const step = Math.max(1, Math.floor(data.length / 90));
  const pts = data.filter((_, i) => i % step === 0 || i === data.length - 1);
  const vals = pts.map((p) => p.balance);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;

  const x = (i: number) => PAD + (i / (pts.length - 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2);

  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.balance).toFixed(1)}`).join(' ');
  const area = `${line} L${x(pts.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  const color = tone === 'light' ? THEME.colors.goldDeep : THEME.colors.goldSoft;
  const gradId = `spark-${id}`;
  const lastX = x(pts.length - 1);
  const lastY = y(pts[pts.length - 1].balance);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`overflow-visible ${className}`}
      role="img"
      aria-label={`${name} balance curve, from ${formatCurrency(pts[0].balance, { compact: true })} to ${formatCurrency(
        pts[pts.length - 1].balance,
        { compact: true },
      )}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className={animate ? 'draw' : undefined}
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
