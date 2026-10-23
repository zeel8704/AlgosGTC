import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="paper border-b border-line">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-28 text-center">
        <Logo size="lg" />
        <p className="mt-10 eyebrow">Page not found</p>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl text-ink leading-tight">
          This page has <em className="text-gold-deep">moved on.</em>
        </h1>
        <p className="mt-6 text-lg text-ink-2">The link may be outdated. Start again from the strategy suite.</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/algos" className="btn btn-dark">
            View strategies <ArrowRight size={14} />
          </Link>
          <Link href="/" className="btn btn-outline">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
