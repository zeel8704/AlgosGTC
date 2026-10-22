// Data-integrity checks for the strategy datasets.
// Re-validates the computed metrics against the MT5 report figures and
// against internal invariants. Run: `npm run check:data` (or `node scripts/check-data.mjs`).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const load = (k) => JSON.parse(readFileSync(join(here, '..', 'src', 'data', 'datasets', `${k}.json`), 'utf8'));

const EPS = 1.0; // USC tolerance for rounding
let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ✓' : '  ✗ FAIL:'} ${msg}`); if (!cond) failures++; };
const near = (a, b, eps = EPS) => Math.abs(a - b) <= eps;

// Parse "2 748 441.23 (75.39%)" -> { abs, pct }
function moneyPct(s) {
  const pct = s.match(/([\d.]+)%/);
  const abs = s.replace(/\([^)]*\)/, '').replace(/\s/g, '').match(/-?[\d.]+/);
  return { abs: abs ? parseFloat(abs[0]) : NaN, pct: pct ? parseFloat(pct[1]) : NaN };
}

for (const key of ['standard', 'mini', 'micro']) {
  const d = load(key);
  const a = d.asTested, adj = d.adjusted, S = d.sourceReported;
  console.log(`\n== ${d.expert} (${key}) ==`);

  // Reconcile against report summary
  ok(near(a.netProfit, parseFloat(S.netProfit)), `net profit matches report (${a.netProfit} ≈ ${parseFloat(S.netProfit)})`);
  ok(near(a.grossProfit, parseFloat(S.grossProfit)), `gross profit matches report`);
  ok(near(a.grossLoss, parseFloat(S.grossLoss)), `gross loss matches report`);
  ok(Math.abs(a.profitFactor - parseFloat(S.profitFactor)) < 1e-4, `profit factor matches report`);
  const ddR = moneyPct(S.balanceDDMax);
  ok(near(a.maxDDAbs, ddR.abs), `max balance DD abs matches report (${a.maxDDAbs} ≈ ${ddR.abs})`);
  if (d.rebase) {
    console.log(`  ℹ rebased ${d.rebase.testedInitial} → ${d.rebase.shownInitial} (fixed-lot): DD % intentionally differs from report`);
    ok(a.maxDDPct > ddR.pct, `rebased max balance DD % > report % (${a.maxDDPct}% vs ${ddR.pct}% at larger base)`);
  } else {
    ok(Math.abs(a.maxDDPct - ddR.pct) < 0.01, `max balance DD % matches report (${a.maxDDPct} ≈ ${ddR.pct})`);
  }

  // Internal invariants
  ok(near(a.netProfit, a.finalBalance - a.initialBalance), `net profit == final - initial`);
  ok(near(a.netProfit, a.grossProfit + a.grossLoss), `net == grossProfit + grossLoss (zero commission/swap)`);
  ok(Math.abs(a.profitFactor - a.grossProfit / Math.abs(a.grossLoss)) < 1e-4, `PF == grossProfit / |grossLoss|`);
  ok(a.wins + a.losses === a.trades, `wins + losses == trades`);

  // Daily series sums to net profit
  const sumPnl = d.dailySeries.reduce((s, x) => s + x.pnlAsTested, 0);
  ok(near(sumPnl, a.netProfit, 5), `daily P&L sums to net profit (${sumPnl.toFixed(2)} ≈ ${a.netProfit})`);

  // Adjusted = as-tested minus removed day
  ok(near(adj.netProfit, a.netProfit - d.removedDay.netPnl, 5), `adjusted net == as-tested net − removed-day net`);
  ok(adj.maxDDAbs <= a.maxDDAbs + EPS, `adjusted max DD ≤ as-tested max DD (${adj.maxDDAbs} ≤ ${a.maxDDAbs})`);
  ok(d.removalDay === d.removedDay.date, `removal day recorded consistently (${d.removalDay})`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED ✓' : `${failures} CHECK(S) FAILED ✗`}`);
process.exit(failures === 0 ? 0 : 1);
