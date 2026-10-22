'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ContactFormData } from '@/types';
import { getAllStrategies } from '@/data/strategies';
import { CheckCircle2, AlertCircle, Send, Info } from 'lucide-react';

const CAPITAL_RANGES = [
  'Under 1L (100,000 USC)',
  '1L – 5L',
  '5L – 10L',
  '10L+',
  'Not sure yet',
];
const NEXT_STEPS = ['Email walkthrough', 'Live call / demo', 'Just send me the reports', 'Not sure yet'];

export function ContactForm() {
  const params = useSearchParams();
  const algoParam = params.get('algo');
  const strategies = getAllStrategies();
  const defaultAlgo = strategies.find((s) => s.config.slug === algoParam)?.config.shortName ?? '';

  const [form, setForm] = useState<ContactFormData>({
    name: '', email: '', country: '', preferredAlgo: defaultAlgo,
    broker: '', capitalRange: '', nextStep: '', message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof ContactFormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.preferredAlgo) e.preferredAlgo = 'Select a strategy.';
    if (!form.capitalRange) e.capitalRange = 'Select a capital range.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const inputCls = 'w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors';
  const labelCls = 'block text-xs font-medium text-[var(--text-secondary)] mb-1.5';
  const errCls = 'text-[10px] text-[var(--negative)] mt-1 flex items-center gap-1';

  if (submitted) {
    return (
      <div className="card card-inner text-center py-12">
        <CheckCircle2 size={40} className="text-[var(--positive)] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Request captured</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-4">
          Thanks, {form.name.split(' ')[0]}. Your evaluation request for <strong className="text-[var(--gold)]">{form.preferredAlgo}</strong> has been validated.
        </p>
        <div className="inline-flex items-start gap-2 text-left max-w-md mx-auto text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-3">
          <Info size={14} className="text-[var(--warning)] flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-[var(--text-secondary)]">Demo mode:</strong> this build has no backend, so nothing was
            sent or stored. To go live, connect this form to an email service or API route (see the README) — the
            validated payload is ready to POST.
          </span>
        </div>
        <div className="mt-6">
          <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">Edit &amp; review again</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card card-inner space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="name">Name *</label>
          <input id="name" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
          {errors.name && <p className={errCls}><AlertCircle size={10} /> {errors.name}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email *</label>
          <input id="email" type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className={errCls}><AlertCircle size={10} /> {errors.email}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="country">Country / region</label>
          <input id="country" className={inputCls} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className={labelCls} htmlFor="algo">Preferred strategy *</label>
          <select id="algo" className={inputCls} value={form.preferredAlgo} onChange={(e) => set('preferredAlgo', e.target.value)}>
            <option value="">Select…</option>
            {strategies.map((s) => <option key={s.config.id} value={s.config.shortName}>{s.config.name}</option>)}
            <option value="Undecided">Undecided</option>
          </select>
          {errors.preferredAlgo && <p className={errCls}><AlertCircle size={10} /> {errors.preferredAlgo}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="broker">Broker / platform</label>
          <input id="broker" className={inputCls} value={form.broker} onChange={(e) => set('broker', e.target.value)} placeholder="Optional (e.g. Vantage / MT5)" />
        </div>
        <div>
          <label className={labelCls} htmlFor="capital">Approx. capital range *</label>
          <select id="capital" className={inputCls} value={form.capitalRange} onChange={(e) => set('capitalRange', e.target.value)}>
            <option value="">Select…</option>
            {CAPITAL_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.capitalRange && <p className={errCls}><AlertCircle size={10} /> {errors.capitalRange}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Preferred next step</label>
        <div className="flex flex-wrap gap-2">
          {NEXT_STEPS.map((step) => (
            <button type="button" key={step} onClick={() => set('nextStep', step)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                form.nextStep === step ? 'bg-[var(--gold-muted)] text-[var(--gold)] border-[var(--gold)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
              }`}>{step}</button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="message">Anything else?</label>
        <textarea id="message" rows={3} className={inputCls} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Optional" />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 max-w-xs">
          <Info size={12} /> Demo form — no data is sent or stored in this build.
        </p>
        <button type="submit" className="btn-primary"><Send size={15} /> Submit request</button>
      </div>
    </form>
  );
}
