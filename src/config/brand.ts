// ─── Brand & Site Configuration ─────────────────────────────────────
// Change these values to rebrand the entire site.

export const BRAND = {
  name: 'Golden Teak Capital',
  shortName: 'Golden Teak',
  tagline: 'Systematic Gold Strategies',
  description:
    'Golden Teak Capital: systematic XAUUSD mean-reversion strategies with documented, real-tick backtest performance.',
  // Placeholder contact details; replace with the firm's real domain/handles before launch.
  url: 'https://goldenteakcapital.com',
  contact: {
    email: 'contact@goldenteakcapital.com',
    telegram: '@goldenteakcapital',
  },
  legal: {
    companyName: 'Golden Teak Capital',
    jurisdiction: 'Not specified',
  },
} as const;

// Palette taken from the Golden Teak Capital logo: cream paper, espresso ink, teak gold.
// The same values are exposed to Tailwind as theme tokens in globals.css; charts read them here.
export const THEME = {
  colors: {
    cream: '#F4EDE2',
    ivory: '#FBF8F2',
    sand: '#EDE3D3',
    line: '#E2D6C2',
    lineStrong: '#CDBB9C',
    ink: '#3A2416',
    ink2: '#6B5444',
    ink3: '#7A6453',
    gold: '#A9822E',
    goldDeep: '#8A6420',
    goldSoft: '#C9A35A',
    espresso: '#2B1A10',
    positive: '#3F6B3A',
    negative: '#A1452F',
  },
} as const;

export const PRODUCT_NAMES: Record<string, string> = {
  Standard: 'GTC Standard',
  Mini: 'GTC Mini',
  Micro: 'GTC Micro',
};

// Positioning label for each tier (ascending by capital).
export const TIER_LABELS: Record<string, { numeral: string; label: string }> = {
  Mini: { numeral: 'I', label: 'Entry' },
  Micro: { numeral: 'II', label: 'Growth' },
  Standard: { numeral: 'III', label: 'Flagship' },
};

export const ALGO_ORDER = ['Mini', 'Micro', 'Standard'] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/algos', label: 'Strategies' },
  { href: '/contact', label: 'Contact' },
] as const;

export const RISK_DISCLAIMER = `Past performance, whether from historical backtesting or forward testing, does not guarantee future results. Algorithmic trading involves substantial risk of loss and is not suitable for every investor. The performance data presented has been obtained from strategy tester reports on demo accounts using historical tick data. Actual trading results may differ materially due to slippage, spread variations, broker execution quality, market conditions, and other factors not fully captured in testing. Capital requirements stated are for informational purposes and do not constitute a guarantee of account safety. Never risk capital you cannot afford to lose.`;

export const CENT_ACCOUNT_NOTE = `Balances and P&L are quoted in USC (US cents) on a cent account. 100 USC = 1 USD. Values are shown exactly as the reports state them, with no conversion applied.`;
