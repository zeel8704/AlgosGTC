import type { Metadata } from 'next';
import './globals.css';
import { BRAND } from '@/config/brand';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.description,
  keywords: ['XAUUSD', 'gold trading', 'algorithmic trading', 'quantitative trading', 'EA', 'MetaTrader 5'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
