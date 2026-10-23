import Link from 'next/link';
import { BRAND, RISK_DISCLAIMER } from '@/config/brand';
import { getAllStrategies } from '@/data/strategies';
import { Logo } from '@/components/Logo';

// Evaluated once at build/import time (not during render) so prerendering stays deterministic.
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const strategies = getAllStrategies();

  return (
    <footer className="bg-espresso text-on-dark">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-on-dark/10">
          <div className="md:col-span-5">
            <Link href="/" aria-label="Golden Teak Capital home" className="inline-block">
              <Logo variant="dark" size="md" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-on-dark-2">
              Systematic mean-reversion strategies for XAUUSD, each sized to the account it was tested on and
              documented with real-tick backtest data.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow-dark mb-5">Strategies</h2>
            <ul className="space-y-3">
              {strategies.map((s) => (
                <li key={s.config.id}>
                  <Link
                    href={`/algos/${s.config.slug}`}
                    className="group flex items-baseline justify-between gap-4 text-sm text-on-dark hover:text-gold-soft transition-colors"
                  >
                    <span>{s.config.name}</span>
                    <span className="tnum text-xs text-on-dark-2 group-hover:text-gold-soft">
                      {s.config.capitalRequirement.minimumINR}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 md:col-start-11">
            <h2 className="eyebrow-dark mb-5">Firm</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/algos" className="text-on-dark hover:text-gold-soft transition-colors">All strategies</Link></li>
              <li><Link href="/contact" className="text-on-dark hover:text-gold-soft transition-colors">Request evaluation</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <p className="lg:col-span-9 text-[11px] leading-relaxed text-on-dark-2">
            <span className="font-semibold text-on-dark">Risk disclosure.</span> {RISK_DISCLAIMER}
          </p>
          <p className="lg:col-span-3 lg:text-right text-[11px] text-on-dark-2">
            © {CURRENT_YEAR} {BRAND.legal.companyName}
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
