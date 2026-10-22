// ─── Brand & Site Configuration ─────────────────────────────────────
// Change these values to rebrand the entire site.

export const BRAND = {
  name: 'Aurum Quant',
  tagline: 'Systematic Gold Trading',
  description: 'Quantitative XAUUSD algorithmic trading systems with documented performance.',
  url: 'https://aurumquant.com',
  contact: {
    email: 'contact@aurumquant.com',
    telegram: '@aurumquant',
  },
  legal: {
    companyName: 'Aurum Quant Technologies',
    jurisdiction: 'Not specified',
  },
} as const;

export const THEME = {
  colors: {
    // Deep navy backgrounds
    bgPrimary: '#0a0e1a',
    bgSecondary: '#0f1628',
    bgTertiary: '#141c33',
    bgCard: '#161e35',
    bgCardHover: '#1a2440',
    // Gold accents
    gold: '#c8a853',
    goldLight: '#dfc06e',
    goldDark: '#a68a3a',
    goldMuted: 'rgba(200, 168, 83, 0.15)',
    // Text
    textPrimary: '#e8e6e1',
    textSecondary: '#8b95a8',
    textMuted: '#5a6478',
    // Status
    positive: '#34d399',
    negative: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    // Borders
    border: 'rgba(200, 168, 83, 0.12)',
    borderHover: 'rgba(200, 168, 83, 0.25)',
  },
} as const;

export const PRODUCT_NAMES: Record<string, string> = {
  Standard: 'Aurum Standard',
  Mini: 'Aurum Mini',
  Micro: 'Aurum Micro',
};

export const ALGO_ORDER = ['Mini', 'Micro', 'Standard'] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/algos', label: 'Algo Portfolio' },
  { href: '/contact', label: 'Contact' },
] as const;

export const RISK_DISCLAIMER = `Past performance, whether from historical backtesting or forward testing, does not guarantee future results. Algorithmic trading involves substantial risk of loss and is not suitable for every investor. The performance data presented has been obtained from strategy tester reports on demo accounts using historical tick data. Actual trading results may differ materially due to slippage, spread variations, broker execution quality, market conditions, and other factors not fully captured in testing. Capital requirements stated are for informational purposes and do not constitute a guarantee of account safety. Never risk capital you cannot afford to lose.`;

export const METHODOLOGY_NOTE = `All performance data is derived from MetaTrader 5 Strategy Tester reports using 100% real tick data on Vantage Markets accounts. Figures are shown in account currency (USC) — these are cent accounts, where 100 USC = 1 USD; values are presented exactly as reported, without currency conversion. The adjusted metrics exclude the single deepest balance-drawdown day from each strategy's backtest — a news-driven event the EA's mobile-pause control is intended to sit out in live trading — and recompute every metric from the remaining deals. Both as-tested and adjusted metrics are presented side by side. These are backtest results, not live or forward-tested trading.`;

export const CENT_ACCOUNT_NOTE = `Balances and P&L are quoted in USC (US cents) on a cent account. 100 USC = 1 USD. Values are shown exactly as the reports state them, with no conversion applied.`;
