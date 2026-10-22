import Link from 'next/link';
import { getAllStrategies } from '@/data/strategies';
import { StrategyCard } from '@/components/StrategyCard';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { formatCurrency } from '@/lib/formatters';
import {
  ArrowRight, Activity, Mail, ChevronDown,
} from 'lucide-react';

export default function HomePage() {
  const strategies = getAllStrategies();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, var(--gold) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--gold) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-muted)] border border-[var(--border)] mb-6 animate-fade-in-up">
              <Activity size={14} className="text-[var(--gold)]" />
              <span className="text-xs font-medium text-[var(--gold)]">
                3 XAUUSD Algorithms · Documented Performance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
              <span className="text-[var(--text-primary)]">Systematic Gold Trading.</span>
              <br />
              <span className="text-gradient-gold">Performance You Can Examine.</span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 animate-fade-in-up-delay-1">
              Explore three XAUUSD trading systems through documented historical testing,
              transparent risk metrics, and capital requirements.
              Every claim backed by verifiable backtest data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-2">
              <Link href="/algos" className="btn-primary text-base px-8 py-3">
                Explore the Strategies <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16 animate-fade-in-up-delay-3">
            <ChevronDown size={24} className="text-[var(--text-muted)] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Algorithm Cards ──────────────────────────────────── */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Three Proven Strategies
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
              Each algorithm is independently backtested on real tick data with transparent performance metrics.
              Choose based on your capital and risk tolerance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((s) => (
              <StrategyCard key={s.config.id} strategy={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Strategy Comparison ──────────────────────────────── */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Head-to-Head Comparison
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
              Compare all three algorithms across key performance and risk metrics.
              Customize which metrics to display and sort by any column.
            </p>
          </div>
          <div className="card card-inner">
            <ComparisonTable strategies={strategies} />
          </div>
        </div>
      </section>

      {/* ── Capital Requirements ──────────────────────────────── */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Capital Requirements
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
              Each strategy was tested at a specific cent-account balance. Amounts are in account
              currency (USC), with a lakh-size label. 100 USC = 1 USD. Higher capital provides a larger
              buffer against news-driven floating drawdowns.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((s) => (
              <div key={s.config.id} className="card card-inner text-center">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{s.config.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">{s.config.platform.symbol}</p>
                <div className="text-3xl font-bold text-gradient-gold mb-1">
                  {s.config.capitalRequirement.minimumINR}
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  {formatCurrency(s.config.capitalRequirement.minimumUSD, { compact: true })} · tested balance
                </p>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Direction</span>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {s.config.direction}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Leverage</span>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {s.config.capitalRequirement.leverage}
                    </p>
                  </div>
                </div>
                {s.config.capitalRequirement.note && (
                  <p className="text-[10px] text-[var(--text-muted)] mt-3 leading-relaxed">
                    {s.config.capitalRequirement.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Are these live trading results?',
                a: 'No. All performance data comes from MetaTrader 5 Strategy Tester backtests using real tick data on demo accounts. Forward testing is planned but not yet completed.',
              },
              {
                q: 'What broker do I need?',
                a: 'The backtests were run on Vantage Markets with 1:500 leverage. Any broker offering XAUUSD on MetaTrader 5 with similar conditions should work, though actual results will vary.',
              },
              {
                q: 'What do the capital figures and "USC" mean?',
                a: 'These run on cent accounts, so balances and P&L are quoted in USC (US cents), where 100 USC = 1 USD. Values are shown exactly as the MT5 reports state them, with no conversion. Each strategy is specified for a balance — Mini 100,000 USC (1L), Micro 300,000 USC (3L), Standard 1,000,000 USC (10L). Micro is rebased from a 500,000 USC source backtest. Deploying below the specified balance raises the risk that a news-driven floating drawdown exceeds the account.',
              },
              {
                q: 'How do I get started?',
                a: 'Use the "Request an Algo Evaluation" form to provide your details. We will assess suitability and provide next steps for your preferred strategy.',
              },
            ].map((faq, i) => (
              <details key={i} className="card group">
                <summary className="card-inner cursor-pointer flex items-center justify-between list-none">
                  <span className="text-sm font-semibold text-[var(--text-primary)] pr-4">{faq.q}</span>
                  <ChevronDown size={18} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
            Ready to Evaluate?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Request an algorithm evaluation to determine which strategy best fits
            your capital, risk tolerance, and trading objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base px-8 py-3">
              <Mail size={18} /> Request an Algo Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
