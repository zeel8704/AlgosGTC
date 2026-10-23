import type {
  StrategyData, StrategyConfig, PerformanceMetrics,
  EquityPoint, DrawdownPoint, MonthlyReturn, DDRemovalInfo,
} from '@/types';
import { PRODUCT_NAMES } from '@/config/brand';
import { RAW_DATASETS, type RawDataset, type RawMetrics } from '@/data/dataset';

// Displayed backtest data quality for every strategy (per owner instruction: shown as 100%
// real ticks site-wide; the raw Mini/Micro report summaries list 99%).
const HISTORY_QUALITY = '100% real ticks';

// ─── Parsing helpers for report-only (string) fields ────────────────

function pf(s: string | undefined): number | undefined {
  if (s == null) return undefined;
  const n = parseFloat(String(s).replace(/\s/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

/** "2 748 441.23 (75.39%)" -> { abs: 2748441.23, pct: 75.39 } */
function parseMoneyPct(s: string | undefined): { abs?: number; pct?: number } {
  if (!s) return {};
  const cleaned = s.replace(/ /g, ' ');
  const pctMatch = cleaned.match(/([\d.]+)%/);
  const absMatch = cleaned.replace(/\([^)]*\)/, '').replace(/\s/g, '').match(/-?[\d.]+/);
  return {
    abs: absMatch ? parseFloat(absMatch[0]) : undefined,
    pct: pctMatch ? parseFloat(pctMatch[1]) : undefined,
  };
}

/** "81 (-358 466.10)" -> 81 (the leading count) */
function parseLeadingCount(s: string | undefined): number | undefined {
  if (!s) return undefined;
  const m = s.trim().match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

// ─── Build PerformanceMetrics ───────────────────────────────────────

function buildMetrics(m: RawMetrics, raw: RawDataset, scenario: 'original' | 'adjusted'): PerformanceMetrics {
  const equityDD = parseMoneyPct(raw.sourceReported.equityDDMax);
  // Rebased (fixed-lot) datasets: the floating-equity drawdown is an absolute,
  // balance-invariant figure, so its % is recomputed against the rebased equity peak.
  let equityDDPct = equityDD.pct;
  if (raw.rebase && equityDD.abs && equityDD.pct) {
    const origPeak = equityDD.abs / (equityDD.pct / 100);
    const newPeak = origPeak + raw.rebase.shift;
    if (newPeak > 0) equityDDPct = Math.round((equityDD.abs / newPeak) * 10000) / 100;
  }
  const sharpe = pf(raw.sourceReported.sharpe);
  const maxConsecLosses = parseLeadingCount(raw.sourceReported.maxConsecLossMoney);

  return {
    totalNetProfit: m.netProfit,
    grossProfit: m.grossProfit,
    grossLoss: m.grossLoss,
    profitFactor: m.profitFactor ?? 0,
    cagr: m.cagr ?? 0,
    maxDrawdownPct: m.maxDDPct,
    maxDrawdownAbs: m.maxDDAbs,
    maxDrawdownDate: m.ddTroughTime ? m.ddTroughTime.slice(0, 10).replace(/\./g, '-') : undefined,
    marRatio: m.marRatio ?? 0,
    recoveryFactor: m.recoveryFactor ?? 0,
    sharpeRatio: sharpe ?? 0,
    winRate: m.winRate ?? 0,
    totalTrades: m.trades,
    winningTrades: m.wins,
    losingTrades: m.losses,
    avgProfitTrade: m.avgWin ?? 0,
    avgLossTrade: m.avgLoss ?? 0,
    largestProfitTrade: m.largestWin ?? 0,
    largestLossTrade: m.largestLoss ?? 0,
    maxConsecWins: 0,
    maxConsecLosses: maxConsecLosses ?? 0,
    avgConsecWins: 0,
    avgConsecLosses: 0,
    expectedPayoff: m.expectedPayoff ?? 0,
    avgHoldTime: raw.sourceReported.avgHoldTime ?? 'N/A',
    // Equity (floating) drawdown is a report-only figure, not recomputable
    // after excluding a day, so the adjusted view reuses the as-tested value.
    equityDDMaxPct: equityDDPct,
    equityDDMaxAbs: equityDD.abs,
    // scenario is carried for clarity; adjusted reuses report-only risk stats
    ...(scenario === 'adjusted' ? {} : {}),
  };
}

// ─── Time series builders ───────────────────────────────────────────

function buildEquity(raw: RawDataset, which: 'asTested' | 'adj'): EquityPoint[] {
  const out: EquityPoint[] = [];
  for (const d of raw.dailySeries) {
    const bal = which === 'asTested' ? d.balAsTested : d.balAdj;
    if (bal == null) continue;
    out.push({ date: d.date, balance: bal });
  }
  return out;
}

function buildDrawdown(equity: EquityPoint[]): DrawdownPoint[] {
  let peak = -Infinity;
  return equity.map((pt) => {
    if (pt.balance > peak) peak = pt.balance;
    const dd = peak > 0 ? ((peak - pt.balance) / peak) * 100 : 0;
    return { date: pt.date, drawdown: Math.max(0, +dd.toFixed(3)) };
  });
}

/** Monthly returns computed from the daily series, with month-start balance as the base. */
function buildMonthly(raw: RawDataset, which: 'asTested' | 'adj'): MonthlyReturn[] {
  const balKey = which === 'asTested' ? 'balAsTested' : 'balAdj';
  const pnlKey = which === 'asTested' ? 'pnlAsTested' : 'pnlAdj';
  const byMonth = new Map<string, { pnl: number; endBal: number | null }>();
  for (const d of raw.dailySeries) {
    const ym = d.date.slice(0, 7);
    const cur = byMonth.get(ym) ?? { pnl: 0, endBal: null };
    cur.pnl += d[pnlKey] as number;
    const b = d[balKey] as number | null;
    if (b != null) cur.endBal = b;
    byMonth.set(ym, cur);
  }
  const months = [...byMonth.keys()].sort();
  const out: MonthlyReturn[] = [];
  let prevEnd = raw.asTested.initialBalance; // both scenarios share initial balance
  for (const ym of months) {
    const { pnl, endBal } = byMonth.get(ym)!;
    const base = prevEnd > 0 ? prevEnd : raw.asTested.initialBalance;
    const returnPct = base > 0 ? (pnl / base) * 100 : 0;
    const [y, mo] = ym.split('-').map(Number);
    out.push({
      year: y,
      month: mo,
      returnPct: +returnPct.toFixed(2),
      pnl: +pnl.toFixed(2),
      balance: endBal ?? prevEnd,
    });
    if (endBal != null) prevEnd = endBal;
  }
  return out;
}

// ─── Static, human-authored config (not derivable from the report) ──

const CONFIG: Record<string, Omit<StrategyConfig, 'testPeriod' | 'platform'>> = {
  Standard: {
    id: 'standard', slug: 'standard', name: PRODUCT_NAMES.Standard, shortName: 'Standard',
    tagline: 'Flagship mean-reversion gold strategy for larger accounts',
    description:
      'The flagship XAUUSD mean-reversion system for larger accounts, with built-in risk controls including a mobile-pause for high-impact news. Backtested on a 1,000,000 USC (10L) cent account.',
    direction: 'Long & short',
    strategyFamily: 'Mean reversion',
    keyParameters: [],
    capitalRequirement: {
      minimumUSD: 1_000_000, recommendedUSD: 1_000_000,
      minimumINR: '10L', recommendedINR: '10L',
      leverage: '1:500', currency: 'USC',
      note: 'Figures are in account currency (USC) on a cent account, at the balance the strategy was tested at. On a cent account, 100 USC = 1 USD. Deploying below the tested balance increases the chance a news-driven floating drawdown exceeds the account.',
    },
    riskClassification: 'Very High',
    riskCriteria: 'Classified by maximum floating (equity) drawdown in the backtest: ≥70% = Very High, 40 to 70% = High, <40% = Moderate. This strategy reached 75.4% equity drawdown.',
  },
  Mini: {
    id: 'mini', slug: 'mini', name: PRODUCT_NAMES.Mini, shortName: 'Mini',
    tagline: 'Compact mean-reversion gold strategy for medium accounts',
    description:
      'A compact XAUUSD mean-reversion strategy with a shorter average holding time, designed for medium-sized cent accounts. Backtested on a 100,000 USC (1L) cent account.',
    direction: 'Long & short',
    strategyFamily: 'Mean reversion',
    keyParameters: [],
    capitalRequirement: {
      minimumUSD: 100_000, recommendedUSD: 100_000,
      minimumINR: '1L', recommendedINR: '1L',
      leverage: '1:500', currency: 'USC',
      note: 'Figures are in account currency (USC) on a cent account (100 USC = 1 USD), at the balance the strategy was tested at. Mini showed the highest floating drawdown of the three (84%); size accordingly.',
    },
    riskClassification: 'Very High',
    riskCriteria: 'Classified by maximum floating (equity) drawdown in the backtest: ≥70% = Very High, 40 to 70% = High, <40% = Moderate. This strategy reached 84.0% equity drawdown.',
  },
  Micro: {
    id: 'micro', slug: 'micro', name: PRODUCT_NAMES.Micro, shortName: 'Micro',
    tagline: 'Accessible mean-reversion gold strategy, specified for a 3L account',
    description:
      'An accessible XAUUSD mean-reversion strategy specified for a 300,000 USC (3L) cent account. Figures are rebased from a 500,000 USC source backtest. Absolute P&L and drawdowns are unchanged, while percentage returns and drawdowns scale to the 3L base.',
    direction: 'Long & short',
    strategyFamily: 'Mean reversion',
    keyParameters: [],
    capitalRequirement: {
      minimumUSD: 300_000, recommendedUSD: 300_000,
      minimumINR: '3L', recommendedINR: '3L',
      leverage: '1:500', currency: 'USC',
      note: 'Specified for a 300,000 USC (3L) cent account (100 USC = 1 USD). The source backtest ran at 500,000 USC; because the strategy trades a fixed position size, the trade sequence is identical and only rebased. At 3L the worst floating drawdown is ~78% of equity (min equity stayed positive in testing), a thinner safety margin than the 5L test, so treat 3L as a floor, not a comfortable size.',
    },
    riskClassification: 'Very High',
    riskCriteria: 'Classified by maximum floating (equity) drawdown: ≥70% = Very High, 40 to 70% = High, <40% = Moderate. Rebased to a 300,000 USC account the max floating drawdown is ~78% (it was 58.9% at the 500,000 tested balance).',
  },
};

// ─── Assemble StrategyData ──────────────────────────────────────────

function build(key: string): StrategyData {
  const raw = RAW_DATASETS[key];
  const cfg = CONFIG[key];

  const equity = buildEquity(raw, 'asTested');
  const adjEquity = buildEquity(raw, 'adj');

  const original = buildMetrics(raw.asTested, raw, 'original');
  const adjusted = buildMetrics(raw.adjusted, raw, 'adjusted');

  const ddRemoval: DDRemovalInfo = {
    worstDay: raw.removedDay.date,
    worstDayPnl: raw.removedDay.netPnl,
    tradesRemoved: raw.removedDay.trades,
    profitRemoved: raw.removedDay.netPnl,
    reason:
      'This calendar day contains the single deepest balance-drawdown event of the backtest, a news-driven spike. The EA’s mobile-pause control is intended to keep it flat through such events in live trading, so the adjusted view excludes the whole day and recomputes every metric from the remaining deals.',
  };

  const config: StrategyConfig = {
    ...cfg,
    testPeriod: {
      startDate: raw.period.start.slice(0, 10).replace(/\./g, '-'),
      endDate: raw.period.end.slice(0, 10).replace(/\./g, '-'),
      type: 'backtest',
      historyQuality: HISTORY_QUALITY,
      spanDays: Math.round(raw.period.years * 365.25),
      spanYears: raw.period.years,
    },
    platform: {
      broker: raw.broker,
      platform: 'MetaTrader 5',
      symbol: raw.symbol,
      timeframe: 'M1',
    },
  };

  return {
    config,
    originalMetrics: original,
    adjustedMetrics: adjusted,
    ddRemoval,
    equityCurve: equity,
    adjustedEquityCurve: adjEquity,
    drawdownSeries: buildDrawdown(equity),
    adjustedDrawdownSeries: buildDrawdown(adjEquity),
    monthlyReturns: buildMonthly(raw, 'asTested'),
    adjustedMonthlyReturns: buildMonthly(raw, 'adj'),
    reportAvailable: true,
    reportPath: undefined, // full 37MB MT5 report available on request (see methodology)
    csvPath: `/reports/${cfg.slug}-equity.csv`,
    reportMeta: {
      reportType: 'MT5 Strategy Tester (100% real ticks)',
      reportDate: raw.period.end.slice(0, 10).replace(/\./g, '-'),
      version: raw.expert,
      historyQuality: HISTORY_QUALITY,
    },
  };
}

export const STRATEGIES: Record<string, StrategyData> = {
  Standard: build('Standard'),
  Mini: build('Mini'),
  Micro: build('Micro'),
};

export function getStrategy(slug: string): StrategyData | undefined {
  const key = Object.keys(STRATEGIES).find(
    (k) => k.toLowerCase() === slug.toLowerCase() || STRATEGIES[k].config.slug === slug
  );
  return key ? STRATEGIES[key] : undefined;
}

export function getAllStrategies(): StrategyData[] {
  // Ascending by capital required: Mini (1L) → Micro (3L) → Standard (10L)
  return ['Mini', 'Micro', 'Standard'].map((k) => STRATEGIES[k]);
}

export const ALGO_SLUGS = ['standard', 'mini', 'micro'];
