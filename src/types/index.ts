// ─── Core Strategy Types ────────────────────────────────────────────

export interface StrategyConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  direction: string;             // e.g. "Long only", "Long & short"
  strategyFamily: string;        // e.g. "ATR-adaptive grid"
  keyParameters: { label: string; value: string }[];
  capitalRequirement: CapitalRequirement;
  testPeriod: TestPeriod;
  platform: PlatformInfo;
  riskClassification: string;
  riskCriteria: string;          // explicit definition of the classification
}

export interface CapitalRequirement {
  minimumUSD: number;       // amount in account currency (USC — cent account)
  recommendedUSD: number;
  minimumINR: string;       // lakh shorthand label, e.g. "1L", "5L", "10L"
  recommendedINR: string;
  leverage: string;
  currency: string;         // "USC" (cent account)
  note?: string;
}

export interface TestPeriod {
  startDate: string;
  endDate: string;
  type: 'backtest' | 'forward-test' | 'hybrid';
  historyQuality: string;
  spanDays: number;
  spanYears: number;
}

export interface PlatformInfo {
  broker: string;
  platform: string;
  symbol: string;
  timeframe: string;
}

// ─── Performance Metrics ────────────────────────────────────────────

export interface PerformanceMetrics {
  totalNetProfit: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  cagr: number;
  maxDrawdownPct: number;
  maxDrawdownAbs: number;
  maxDrawdownDate?: string;
  marRatio: number;
  recoveryFactor: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgProfitTrade: number;
  avgLossTrade: number;
  largestProfitTrade: number;
  largestLossTrade: number;
  maxConsecWins: number;
  maxConsecLosses: number;
  avgConsecWins: number;
  avgConsecLosses: number;
  expectedPayoff: number;
  avgHoldTime: string;
  totalSwap?: number;
  totalCommission?: number;
  // Equity drawdown (different from balance DD)
  equityDDMaxPct?: number;
  equityDDMaxAbs?: number;
}

export interface DDRemovalInfo {
  worstDay: string;
  worstDayPnl: number;
  tradesRemoved: number;
  profitRemoved: number;
  reason: string;
}

// ─── Time Series Data ───────────────────────────────────────────────

export interface EquityPoint {
  date: string;
  balance: number;
}

export interface DrawdownPoint {
  date: string;
  drawdown: number;
}

export interface MonthlyReturn {
  year: number;
  month: number;
  returnPct: number;
  pnl: number;
  balance: number;
}

// ─── Full Strategy Data ─────────────────────────────────────────────

export interface StrategyData {
  config: StrategyConfig;
  originalMetrics: PerformanceMetrics;
  adjustedMetrics: PerformanceMetrics;
  ddRemoval: DDRemovalInfo;
  equityCurve: EquityPoint[];
  adjustedEquityCurve: EquityPoint[];
  drawdownSeries: DrawdownPoint[];
  adjustedDrawdownSeries: DrawdownPoint[];
  monthlyReturns: MonthlyReturn[];
  adjustedMonthlyReturns: MonthlyReturn[];
  reportAvailable: boolean;
  reportPath?: string;
  csvPath?: string;
  reportMeta: {
    reportType: string;
    reportDate: string;
    version: string;
    historyQuality: string;
  };
}

// ─── Comparison ─────────────────────────────────────────────────────

export type MetricKey = keyof PerformanceMetrics;

export interface ComparisonMetric {
  key: MetricKey;
  label: string;
  description: string;
  format: 'currency' | 'percentage' | 'number' | 'ratio' | 'time';
  higherIsBetter?: boolean;
}

// ─── Performance Lab ────────────────────────────────────────────────

export type ChartType = 'equity' | 'drawdown' | 'monthly' | 'cumulative';
export type PeriodFilter = 'full' | '2024' | '2025' | '2026' | 'custom';

export interface LabFilters {
  selectedAlgos: string[];
  chartType: ChartType;
  period: PeriodFilter;
  normalized: boolean;
  showAdjusted: boolean;
}

// ─── Contact Form ───────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  country: string;
  preferredAlgo: string;
  broker: string;
  capitalRange: string;
  nextStep: string;
  message?: string;
}
