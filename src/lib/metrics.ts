import type { ComparisonMetric } from '@/types';

/**
 * All metrics available for display and comparison.
 * Each metric includes a tooltip description, format, and sort direction.
 */
export const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    key: 'cagr',
    label: 'CAGR',
    description: 'Compound Annual Growth Rate: the annualized return over the test period.',
    format: 'percentage',
    higherIsBetter: true,
  },
  {
    key: 'totalNetProfit',
    label: 'Net Profit',
    description: 'Total realized profit after commissions, swaps, and fees.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'maxDrawdownPct',
    label: 'Max Drawdown',
    description: 'Largest peak-to-trough balance decline as a percentage. Lower is better.',
    format: 'percentage',
    higherIsBetter: false,
  },
  {
    key: 'equityDDMaxPct',
    label: 'Max Equity DD',
    description: 'Largest floating (unrealized) drawdown of account equity during the test. Lower is better.',
    format: 'percentage',
    higherIsBetter: false,
  },
  {
    key: 'marRatio',
    label: 'MAR Ratio',
    description: 'CAGR divided by maximum drawdown percentage. Higher means better risk-adjusted return.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'profitFactor',
    label: 'Profit Factor',
    description: 'Gross profit divided by gross loss. Values above 1.0 indicate net profitability.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'winRate',
    label: 'Win Rate',
    description: 'Percentage of closed trades that were profitable.',
    format: 'percentage',
    higherIsBetter: true,
  },
  {
    key: 'totalTrades',
    label: 'Total Trades',
    description: 'Number of closed round-trip trades during the test period.',
    format: 'integer',
  },
  {
    key: 'sharpeRatio',
    label: 'Sharpe Ratio',
    description: 'Risk-adjusted return metric. Higher values indicate better return per unit of risk.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'recoveryFactor',
    label: 'Recovery Factor',
    description: 'Net profit divided by maximum drawdown. Measures how well the strategy recovers from losses.',
    format: 'ratio',
    higherIsBetter: true,
  },
  {
    key: 'expectedPayoff',
    label: 'Expected Payoff',
    description: 'Average profit per trade, accounting for both winners and losers.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'maxDrawdownAbs',
    label: 'Max DD (Absolute)',
    description: 'Largest peak-to-trough balance decline in dollar terms.',
    format: 'currency',
    higherIsBetter: false,
  },
  {
    key: 'grossProfit',
    label: 'Gross Profit',
    description: 'Sum of all profitable trades before costs.',
    format: 'currency',
    higherIsBetter: true,
  },
  {
    key: 'grossLoss',
    label: 'Gross Loss',
    description: 'Sum of all losing trades (shown as negative).',
    format: 'currency',
    higherIsBetter: false,
  },
  {
    key: 'largestProfitTrade',
    label: 'Best Trade',
    description: 'Profit of the single most profitable trade.',
    format: 'currency',
  },
  {
    key: 'largestLossTrade',
    label: 'Worst Trade',
    description: 'Loss of the single worst trade.',
    format: 'currency',
  },
  {
    key: 'avgHoldTime',
    label: 'Avg Hold Time',
    description: 'Average time a position was held open.',
    format: 'time',
  },
];

/** Default metrics shown in the comparison table */
export const DEFAULT_COMPARISON_KEYS: string[] = [
  'cagr',
  'totalNetProfit',
  'maxDrawdownPct',
  'equityDDMaxPct',
  'profitFactor',
  'winRate',
  'totalTrades',
];
