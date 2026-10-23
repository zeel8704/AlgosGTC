'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/brand';
import { Logo } from '@/components/Logo';
import { ArrowRight, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 border-b ${
        scrolled || mobileOpen
          ? 'bg-cream/92 backdrop-blur-md border-line shadow-[0_10px_30px_-24px_rgba(58,36,22,0.45)]'
          : 'bg-cream/0 border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10" aria-label="Primary">
        <div className="flex items-center justify-between h-20">
          <Link href="/" aria-label="Golden Teak Capital home" onClick={() => setMobileOpen(false)}>
            <Logo size="md" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative py-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                        active ? 'text-ink' : 'text-ink-2 hover:text-ink'
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute left-0 right-0 -bottom-0.5 h-px bg-gold transition-transform duration-300 origin-left ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href="/contact" className="btn btn-dark py-3 px-5">
              Request evaluation <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden -mr-2 p-2 text-ink"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-line bg-cream">
          <ul className="px-5 sm:px-8 py-6 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between py-3 border-b border-line font-display text-2xl ${
                      active ? 'text-ink' : 'text-ink-2'
                    }`}
                  >
                    {link.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-5 sm:px-8 pb-8">
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn btn-dark w-full">
              Request evaluation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
