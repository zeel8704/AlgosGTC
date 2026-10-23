# Golden Teak Capital: XAUUSD Strategy Showcase

A production-quality marketing + analytics site for three XAUUSD (gold) algorithmic
trading strategies. Built with Next.js (App Router), TypeScript, Tailwind CSS and
Recharts. Every performance figure is derived from, and reconciled to, the source
MetaTrader 5 Strategy Tester reports. Nothing is estimated or fabricated.

> **These are historical backtests, not live or forward-tested results.** The site
> states this throughout and discloses the exact data adjustments it makes.

---

## What's inside

| Strategy | Direction | Tested balance | Net profit | Max balance DD | Max equity DD |
|----------|-----------|----------------|------------|----------------|---------------|
| **Standard** | Long only | 1,000,000 USC (10L) | 3,537,030 USC | 17.24% | 75.39% |
| **Mini** | Long & short | 100,000 USC (1L) | 258,522 USC | 21.48% | 83.96% |
| **Micro** | Long & short | 300,000 USC (3L)* | 809,178 USC | 30.02% | ~78.5% |

\* Micro is **rebased** from its 500,000 USC source backtest to a 300,000 USC (3L) account.
It trades a fixed position size, so trades are identical at any balance: absolute P&L and
drawdowns (net profit, gross, PF, drawdown in USC, trade counts) are unchanged; only the
percentage returns/drawdowns scale to the smaller base.

All three are mean-reversion EAs on XAUUSD, backtested on 100% real tick data on
Vantage Markets over ~2.7 years (Jan 2024 → Sep 2026).

### Account currency (USC)

These run on **cent accounts**, so every balance and P&L figure is in **USC (US cents)**,
where **100 USC = 1 USD**. Values are shown exactly as the reports state them, with no
currency conversion applied (per project requirement). "10L / 5L / 1L" are lakh-size
labels for the tested cent-account balances.

### As-tested figures only

The site shows every metric exactly as the MT5 report produced it (as-tested). The data
layer still computes an "adjusted (ex-news-day)" variant (excluding the single calendar
day with each strategy's deepest balance-drawdown event), but it is not displayed.
The realized balance curve rarely prints a losing day; the real downside is the
**floating equity drawdown**, which is shown as "Max equity DD".

---

## Pages

- `/`: homepage (hero + strategy ledger, approach, GTC suite, capital ladder,
  head-to-head comparison, FAQ, CTA)
- `/algos`: strategy suite (cards, capital requirements, head-to-head table)
- `/algos/[slug]`: per-strategy detail (`mini` / `micro` / `standard`): key figures,
  balance curve, monthly returns, trade statistics, backtest and capital details (as-tested)
- `/contact`: "Request an evaluation" form (validated, **demo mode**; see below)

Strategies are named GTC Mini, GTC Micro and GTC Standard and appear everywhere in
ascending order of tested capital (1L → 3L → 10L). Strategy internals and parameters are
not published; each is described only as mean reversion.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (prerenders all routes)
npm start            # serve the production build
npm run check:data   # re-validate datasets against the MT5 report totals
```

Requirements: Node 18.18+ (tested on Node 22). No database, API keys, or environment
variables are needed to run or display the site.

---

## Data pipeline

The three MT5 `.xlsx` reports are large (≈37 MB each, UTF-16, ~190k deal rows) and
contain account identifiers, so they are **not** committed. They were parsed offline
into compact, validated JSON:

- `src/data/datasets/{standard,mini,micro}.json`: summary metrics, daily balance
  series (as-tested + adjusted), monthly aggregates, and the report passthrough.
- `src/data/dataset.ts`: typed loader for the JSON.
- `src/data/strategies.ts`: transforms datasets + human-authored config into the
  `StrategyData` shape the UI consumes (equity/drawdown series, monthly returns, both
  metric scenarios).
- `src/lib/analytics` conventions live in `src/lib/formatters.ts` and the transformer;
  `scripts/check-data.mjs` asserts the computed figures reconcile to the report.

`npm run check:data` prints 14 checks per strategy (net profit, gross, profit factor,
balance drawdown, trade counts, daily-sum, adjusted invariants). All must pass.

### Downloadable data

Each strategy page offers a real **daily equity series CSV** (`public/reports/*-equity.csv`).
The full MT5 Strategy Tester report is intentionally not published (size + account
identifiers) and is offered "on request".

---

## Deploying to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel, **New Project → Import** the repo. Framework preset: **Next.js** (auto-detected).
3. Build command `next build`, output handled automatically. No environment variables required.
4. Deploy. The site is fully static/prerendered and needs no runtime secrets.

Alternatively, from this directory:

```bash
npx vercel          # preview deploy
npx vercel --prod   # production deploy
```

### Custom domain checklist

- [ ] Add the domain in Vercel → Project → Settings → Domains.
- [ ] Point DNS (A/ALIAS or CNAME) to Vercel as instructed there.
- [ ] Wait for SSL to provision (automatic).
- [ ] Update `BRAND.url` in `src/config/brand.ts` to the final domain.
- [ ] Set the domain as primary and verify redirects.

---

## Rebranding / configuration

Everything brandable is centralized:

- `src/config/brand.ts`: name, tagline, contact placeholders, legal, nav links,
  product names, tier labels, palette (read by the charts), risk disclaimer, cent-account note.
- `src/app/globals.css`: Tailwind theme tokens taken from the Golden Teak Capital logo
  (cream, ivory, espresso ink, teak gold), plus button, card and typography styles.
- `src/components/Logo.tsx`: the Golden Teak Capital wordmark (tracked EB Garamond capitals), rendered in code.
- Fonts: EB Garamond (wordmark), Playfair Display (headings) and Inter (text), loaded with `next/font` in
  `src/app/layout.tsx`. `src/app/opengraph-image.png` is the logo used for link previews.

Change the brand name, product names, theme colors, and copy there without touching
components.

---

## Implemented vs. future integrations

**Works now, no integrations:** all pages, charts, the comparison table, capital
displays, and the validated dataset.

**Placeholders / future work (clearly marked in the UI):**

- **Contact form** runs in **demo mode**: it validates input and shows a success state
  but sends/stores nothing. To go live, POST the validated payload from
  `src/components/ContactForm.tsx` to an email service (e.g. Resend) or a Next.js route
  handler / form backend.
- **Forward-test** sections are labelled "not yet available"; wire in a forward-test
  dataset in the same shape when ready.
- A **database / client portal / account verification** can be added behind the existing
  data layer without reworking the frontend.

---

## Tech

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript (strict) ·
Tailwind CSS 4 · Recharts 3 · lucide-react.
