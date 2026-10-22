/**
 * Consistent formatting utilities for currency, percentages, dates, and numbers.
 */

// ─── Currency ───────────────────────────────────────────────────────

// Accounts are cent accounts; the reporting unit is USC (US cent).
// Per request, reported values are shown as-is (USD figures relabeled USC,
// no numeric conversion). 100 USC = 1 USD.
export const ACCOUNT_CURRENCY = 'USC';

export function formatCurrency(
  value: number | null | undefined,
  opts?: { compact?: boolean; decimals?: number; currency?: string }
): string {
  if (value === null || value === undefined) return 'N/A';
  const { compact = false, decimals = 2, currency = ACCOUNT_CURRENCY } = opts ?? {};
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (compact && abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(2)}M ${currency}`;
  }
  if (compact && abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K ${currency}`;
  }

  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${num} ${currency}`;
}

// ─── Percentage ─────────────────────────────────────────────────────

export function formatPercent(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatPercentUnsigned(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

// ─── Numbers ────────────────────────────────────────────────────────

export function formatNumber(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRatio(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(decimals);
}

// ─── Dates ──────────────────────────────────────────────────────────

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parse a YYYY-MM-DD string into [y, m, d] without timezone/Date involvement. */
function parseYMD(dateStr: string): [number, number, number] | null {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

// Deterministic across server/client (no Date, no locale) — avoids hydration drift.
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  const p = parseYMD(dateStr);
  if (!p) return dateStr;
  return `${MONTHS_SHORT[p[1] - 1]} ${p[2]}, ${p[0]}`;
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  const p = parseYMD(dateStr);
  if (!p) return dateStr;
  return `${MONTHS_SHORT[p[1] - 1]} ${p[0]}`;
}

/** "YYYY-MM-DD" -> "Jan '24" (deterministic, for chart axis ticks). */
export function formatMonthYear(dateStr: string): string {
  const p = parseYMD(dateStr);
  if (!p) return dateStr;
  return `${MONTHS_SHORT[p[1] - 1]} '${String(p[0]).slice(2)}`;
}

export function formatMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] ?? '';
}

// ─── Metric Formatting ──────────────────────────────────────────────

export type MetricFormat = 'currency' | 'percentage' | 'number' | 'ratio' | 'integer' | 'time';

export function formatMetric(
  value: number | string | null | undefined,
  format: MetricFormat
): string {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return formatCurrency(value, { compact: Math.abs(value) > 100000 });
    case 'percentage':
      return formatPercentUnsigned(value);
    case 'number':
      return formatNumber(value);
    case 'ratio':
      return formatRatio(value);
    case 'integer':
      return formatInteger(value);
    case 'time':
      return String(value);
    default:
      return String(value);
  }
}
