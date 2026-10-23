import type { Metadata } from 'next';
import { EB_Garamond, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { BRAND } from '@/config/brand';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const display = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Wordmark face for the Golden Teak Capital logo.
const wordmark = EB_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: ['Golden Teak Capital', 'GTC', 'XAUUSD', 'gold trading', 'algorithmic trading', 'mean reversion', 'MetaTrader 5'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${wordmark.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-espresso focus:text-on-dark focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
