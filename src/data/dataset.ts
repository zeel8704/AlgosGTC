// ─── Raw dataset types + loader ─────────────────────────────────────
// These JSON files are produced by the offline extractor from the MT5
// Strategy Tester xlsx reports. Every number is verified against the
// report summary (net profit, gross, profit factor, balance drawdown,
// trade counts and largest win/loss all reconcile to the penny).

import standardJson from './datasets/standard.json';
import miniJson from './datasets/mini.json';
import microJson from './datasets/micro.json';

export interface RawMetrics {
  initialBalance: number;
  finalBalance: number;
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number | null;
  trades: number;
  wins: number;
  losses: number;
  winRate: number | null;
  avgWin: number | null;
  avgLoss: number | null;
  largestWin: number | null;
  largestLoss: number | null;
  maxDDAbs: number;
  maxDDPct: number;
  ddPeakTime: string | null;
  ddTroughTime: string | null;
  cagr: number | null;
  marRatio: number | null;
  expectedPayoff: number | null;
  recoveryFactor: number | null;
}

export interface RawDailyPoint {
  date: string;
  balAsTested: number | null;
  pnlAsTested: number;
  balAdj: number;
  pnlAdj: number;
}

export interface RawDataset {
  algoKey: string;
  symbol: string;
  expert: string;
  broker: string;
  currencyReported: string;
  leverage: string;
  period: { start: string; end: string; years: number };
  rebase: { testedInitial: number; shownInitial: number; shift: number; fixedLot: boolean } | null;
  removalDay: string;
  removedDay: { date: string; netPnl: number; trades: number; deals: number };
  asTested: RawMetrics;
  adjusted: RawMetrics;
  sourceReported: Record<string, string | undefined>;
  monthlyAsTested: Record<string, number>;
  monthlyAdj: Record<string, number>;
  dailySeries: RawDailyPoint[];
}

export const RAW_DATASETS: Record<string, RawDataset> = {
  Standard: standardJson as unknown as RawDataset,
  Mini: miniJson as unknown as RawDataset,
  Micro: microJson as unknown as RawDataset,
};
