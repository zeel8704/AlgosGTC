'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND, NAV_LINKS } from '@/config/brand';
import { Menu, X, TrendingUp } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))' }}>
              <TrendingUp size={18} className="text-[#0a0e1a]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gradient-gold">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-[var(--gold)] bg-[var(--gold-muted)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-primary ml-3 text-sm py-2 px-4">
              Request Evaluation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-[var(--gold)] bg-[var(--gold-muted)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link href="/contact" className="btn-primary w-full justify-center text-sm">
                Request Evaluation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
