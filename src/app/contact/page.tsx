import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from '@/components/ContactForm';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: `Request an Evaluation — ${BRAND.name}`,
  description: 'Request an evaluation of the XAUUSD strategies for your capital and risk tolerance.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs font-medium text-[var(--gold)] uppercase tracking-wider mb-2">Contact</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Request an Algo Evaluation</h1>
      <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
        Tell us a little about your setup and we&rsquo;ll assess which strategy fits your capital and risk tolerance.
        No obligation — this is an evaluation, not a purchase.
      </p>
      <Suspense fallback={<div className="card card-inner h-96 skeleton" />}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
