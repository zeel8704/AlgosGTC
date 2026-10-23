import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Request an evaluation',
  description: 'Request a private evaluation of the GTC strategies for your capital and risk tolerance.',
};

const STEPS = [
  { n: '01', title: 'Share your setup', body: 'Capital range, broker and the tier you are considering. It takes two minutes.' },
  { n: '02', title: 'We review fit', body: 'We compare your account against the balance each strategy was tested on.' },
  { n: '03', title: 'Walkthrough', body: 'You receive a recommendation and the reports behind it, by email or a call.' },
];

export default function ContactPage() {
  return (
    <section className="paper border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 pb-24 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow rise">Contact</p>
          <h1 className="mt-6 font-display text-[46px] sm:text-[60px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
            Request a private <em className="text-gold-deep">evaluation.</em>
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-ink-2 rise rise-2">
            Tell us a little about your account and we&rsquo;ll assess which strategy fits your capital and risk
            tolerance. No obligation. This is an evaluation, not a purchase.
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
