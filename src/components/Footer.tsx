import Link from 'next/link';
import { BRAND, RISK_DISCLAIMER } from '@/config/brand';
import { TrendingUp } from 'lucide-react';

// Evaluated once at build/import time (not during render) so prerendering stays deterministic.
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))' }}>
                <TrendingUp size={14} className="text-[#0a0e1a]" />
              </div>
              <span className="text-sm font-bold text-gradient-gold">{BRAND.name}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {BRAND.tagline}. Quantitative XAUUSD algorithmic trading systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Strategies
            </h4>
            <ul className="space-y-2">
              {['Standard', 'Mini', 'Micro'].map((algo) => (
                <li key={algo}>
                  <Link href={`/algos/${algo.toLowerCase()}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
                    Aurum {algo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              <li><Link href="/algos" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Algo Portfolio</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="border-t border-[var(--border)] pt-6">
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed max-w-4xl">
            <strong className="text-[var(--text-secondary)]">Risk Disclosure:</strong>{' '}
            {RISK_DISCLAIMER}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-4">
            © {CURRENT_YEAR} {BRAND.legal.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
