import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Get started',
  description:
    'Tell Golden Teak Capital how much you can start with. We recommend a plan, explain the numbers and share pricing. Free, with no obligation.',
};

const STEPS = [
  { n: '01', title: 'Tell us about yourself', body: 'How much you can start with, and your broker if you already have one. Two minutes.' },
  { n: '02', title: 'We recommend a plan', body: 'We compare your starting balance with the balance each plan was tested on, then walk you through the numbers and pricing.' },
  { n: '03', title: 'We set you up', body: 'You open and fund a broker account in your name and grant us trading access. GTC starts trading, and you watch it live.' },
];

export default function ContactPage() {
  return (
    <section className="paper border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 pb-24 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow rise">Get started</p>
          <h1 className="mt-6 font-display text-[46px] sm:text-[60px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
            Start with a <em className="text-gold-deep">conversation.</em>
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-ink-2 rise rise-2">
            Tell us a little about yourself and we will recommend the plan that fits, explain every number, and share
            pricing. The evaluation is free and carries no obligation.
          </p>

          <ol className="mt-12 border-t border-line rise rise-3">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
                <span className="font-display italic text-2xl text-gold leading-none pt-0.5">{s.n}</span>
                <div>
                  <h2 className="font-display text-xl text-ink">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm text-ink-2 rise rise-4">
            New to all this?{' '}
            <Link href="/how-it-works" className="link-gold">
              Read how it works first <ArrowUpRight size={13} />
            </Link>
          </p>
        </div>

        <div className="lg:col-span-7 rise rise-2">
          <Suspense fallback={<div className="card h-[640px] animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
