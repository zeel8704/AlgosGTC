import type { ComparisonMetric } from '@/types';

/**
 * Every metric the site shows, in plain language.
 * `label` is what a first-time reader sees; `technical` is the conventional name, shown in
 * tooltips next to the explanation so experienced readers can map it back.
 */
export const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    key: 'cagr',
    label: 'Growth per year',
    technical: 'CAGR',
    description:
      'How much the account grew each year on average during the test, with profits reinvested. 60% means 1L would have become about 1.6L in a year, if the test repeated.',
    format: 'percentage',
    higherIsBetter: true,
  },
  {
    key: 'totalNetProfit',
    label: 'Profit in the test',
    technical: 'Net profit',
    description: 'Total profit the account made over the whole test after all trading costs, in USC.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'maxDrawdownPct',
    label: 'Biggest fall from peak',
    technical: 'Max balance drawdown',
    description:
      'The largest drop in the account balance from a high point to the next low point, counting closed trades only. Lower is better.',
    format: 'percentage',
    higherIsBetter: false,
  },
  {
    key: 'equityDDMaxPct',
    label: 'Deepest open-trade dip',
    technical: 'Max equity drawdown',
    description:
      'At the worst moment of the test, how far the account value fell while trades were still open and waiting for gold to recover. This is the figure to size your capital for. Lower is better.',
    format: 'percentage',
    higherIsBetter: false,
  },
  {
    key: 'marRatio',
    label: 'Growth vs. biggest fall',
    technical: 'MAR ratio',
    description: 'Growth per year divided by the biggest fall from peak. Higher means more growth for the pain endured.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'profitFactor',
    label: 'Earned per 1 lost',
    technical: 'Profit factor',
    description:
      'Total profit from winning trades divided by total loss from losing trades. 1.5 means the strategy earned 1.50 for every 1.00 it lost. Anything above 1 is profitable overall.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'winRate',
    label: 'Winning trades',
    technical: 'Win rate',
    description: 'The share of closed trades that ended in profit.',
    format: 'percentage',
    higherIsBetter: true,
  },
  {
    key: 'totalTrades',
    label: 'Trades in the test',
    technical: 'Total trades',
    description: 'How many trades were opened and closed during the 2.7-year test.',
    format: 'integer',
  },
  {
    key: 'sharpeRatio',
    label: 'Steadiness of returns',
    technical: 'Sharpe ratio',
    description: 'A standard score of return against its ups and downs. Higher means the growth was steadier.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'recoveryFactor',
    label: 'Profit vs. biggest fall',
    technical: 'Recovery factor',
    description: 'Total profit divided by the biggest fall from peak. Higher means the losses were small next to what was earned.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'expectedPayoff',
    label: 'Average result per trade',
    technical: 'Expected payoff',
    description: 'The average profit or loss per trade, counting winners and losers together.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'maxDrawdownAbs',
    label: 'Biggest fall from peak (USC)',
    technical: 'Max drawdown, absolute',
    description: 'The biggest fall from peak measured in USC rather than as a percentage. Lower is better.',
    format: 'currency',
    higherIsBetter: false,
  },
  {
    key: 'grossProfit',
    label: 'Total from winning trades',
    technical: 'Gross profit',
    description: 'All winning trades added together, before losing trades are subtracted.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'grossLoss',
    label: 'Total from losing trades',
    technical: 'Gross loss',
    description: 'All losing trades added together, shown as a negative number.',
    format: 'currency',
    higherIsBetter: false,
  },
  {
    key: 'largestProfitTrade',
    label: 'Best single trade',
    technical: 'Largest profit trade',
    description: 'The profit on the single most profitable trade.',
    format: 'currency',
  },
  {
    key: 'largestLossTrade',
    label: 'Worst single trade',
    technical: 'Largest loss trade',
    description: 'The loss on the single worst trade.',
    format: 'currency',
  },
  {
    key: 'avgHoldTime',
    label: 'Typical trade length',
    technical: 'Average hold time',
    description: 'How long a trade stayed open on average, as hours:minutes:seconds.',
    format: 'time',
  },
  // Shown on the strategy page only (not available as comparison columns).
  { key: 'winningTrades', label: 'Number of winning trades', technical: 'Winning trades', description: 'How many closed trades ended in profit.', format: 'integer' },
  { key: 'losingTrades', label: 'Number of losing trades', technical: 'Losing trades', description: 'How many closed trades ended in a loss.', format: 'integer' },
  { key: 'avgProfitTrade', label: 'Average winning trade', technical: 'Average profit trade', description: 'The average profit on a winning trade, in USC.', format: 'currency' },
  { key: 'avgLossTrade', label: 'Average losing trade', technical: 'Average loss trade', description: 'The average loss on a losing trade, in USC.', format: 'currency' },
];

/** Metrics offered as columns in the comparison table. */
export const COLUMN_METRICS = COMPARISON_METRICS.slice(0, 17);

/** Default columns in the comparison table. */
export const DEFAULT_COMPARISON_KEYS: string[] = [
  'cagr',
  'totalNetProfit',
  'maxDrawdownPct',
  'equityDDMaxPct',
  'profitFactor',
  'winRate',
  'totalTrades',
];

const byKey = new Map(COMPARISON_METRICS.map((m) => [m.key, m]));

/** Plain label, technical name and explanation for a metric key. */
export function metricText(key: ComparisonMetric['key']) {
  const m = byKey.get(key);
  if (!m) throw new Error(`Unknown metric: ${String(key)}`);
  return { label: m.label, technical: m.technical ?? m.label, help: m.description };
}
