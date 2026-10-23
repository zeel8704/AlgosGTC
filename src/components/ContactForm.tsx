'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ContactFormData } from '@/types';
import { getAllStrategies } from '@/data/strategies';
import { AlertCircle, ArrowRight, Check, Info } from 'lucide-react';

const CAPITAL_RANGES = ['Under 1L (100,000 USC)', '1L to 5L', '5L to 10L', '10L+', 'Not sure yet'];
const NEXT_STEPS = ['Email walkthrough', 'Live call / demo', 'Just send me the reports', 'Not sure yet'];

type Errors = Partial<Record<keyof ContactFormData, string>>;

export function ContactForm() {
  const params = useSearchParams();
  const algoParam = params.get('algo');
  const strategies = getAllStrategies();
  const defaultAlgo = strategies.find((s) => s.config.slug === algoParam)?.config.shortName ?? '';

  const [form, setForm] = useState<ContactFormData>({
    name: '', email: '', country: '', preferredAlgo: defaultAlgo,
    broker: '', capitalRange: '', nextStep: '', message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof ContactFormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
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

  const selectedName = strategies.find((s) => s.config.shortName === form.preferredAlgo)?.config.name ?? form.preferredAlgo;

  const inputCls = (err?: string) =>
    `w-full rounded-[3px] border bg-ivory px-4 py-3 text-[15px] text-ink placeholder:text-ink-3/70 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
      err ? 'border-negative focus:border-negative' : 'border-line-strong hover:border-ink-3 focus:border-gold-deep'
    }`;
  const labelCls = 'label text-[10.5px] mb-2 block';

  const errorText = (id: string, msg?: string) =>
    msg ? (
      <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-negative">
        <AlertCircle size={12} /> {msg}
      </p>
    ) : null;

  if (submitted) {
    return (
      <div className="card p-10 sm:p-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-on-dark">
          <Check size={24} />
        </span>
        <h2 className="mt-7 font-display text-3xl text-ink">Request captured</h2>
        <p className="mt-4 mx-auto max-w-md text-ink-2 leading-relaxed">
          Thank you, {form.name.split(' ')[0]}. Your evaluation request for{' '}
          <strong className="font-semibold text-gold-deep">{selectedName}</strong> has been validated.
        </p>
        <div className="mt-8 mx-auto flex max-w-md items-start gap-3 rounded-[4px] border border-line bg-sand/60 p-4 text-left text-xs leading-relaxed text-ink-2">
          <Info size={14} className="mt-0.5 shrink-0 text-gold-deep" />
          <span>
            <strong className="text-ink">Demo mode:</strong> this build has no backend, so nothing was sent or stored.
            To go live, connect this form to an email service or API route (see the README). The validated payload is
            ready to POST.
          </span>
        </div>
        <button onClick={() => setSubmitted(false)} className="btn btn-outline mt-8">
          Edit &amp; review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-10" noValidate>
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-6 mb-8">
        <h2 className="font-display text-2xl text-ink">Your details</h2>
        <span className="text-xs text-ink-3">* required</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label className={labelCls} htmlFor="name">Name *</label>
          <input id="name" autoComplete="name" className={inputCls(errors.name)} value={form.name}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined}
            onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
          {errorText("name-err", errors.name)}
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email *</label>
          <input id="email" type="email" autoComplete="email" className={inputCls(errors.email)} value={form.email}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined}
            onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
          {errorText("email-err", errors.email)}
        </div>
        <div>
          <label className={labelCls} htmlFor="algo">Preferred strategy *</label>
          <select id="algo" className={inputCls(errors.preferredAlgo)} value={form.preferredAlgo}
            aria-invalid={!!errors.preferredAlgo} aria-describedby={errors.preferredAlgo ? 'algo-err' : undefined}
            onChange={(e) => set('preferredAlgo', e.target.value)}>
            <option value="">Select a tier…</option>
            {strategies.map((s) => (
              <option key={s.config.id} value={s.config.shortName}>
                {s.config.name} ({s.config.capitalRequirement.minimumINR})
              </option>
            ))}
            <option value="Undecided">Undecided</option>
          </select>
          {errorText("algo-err", errors.preferredAlgo)}
        </div>
        <div>
          <label className={labelCls} htmlFor="capital">Approx. capital *</label>
          <select id="capital" className={inputCls(errors.capitalRange)} value={form.capitalRange}
            aria-invalid={!!errors.capitalRange} aria-describedby={errors.capitalRange ? 'capital-err' : undefined}
            onChange={(e) => set('capitalRange', e.target.value)}>
            <option value="">Select a range…</option>
            {CAPITAL_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errorText("capital-err", errors.capitalRange)}
        </div>
        <div>
          <label className={labelCls} htmlFor="country">Country / region</label>
          <input id="country" autoComplete="country-name" className={inputCls()} value={form.country}
            onChange={(e) => set('country', e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className={labelCls} htmlFor="broker">Broker / platform</label>
          <input id="broker" className={inputCls()} value={form.broker}
            onChange={(e) => set('broker', e.target.value)} placeholder="e.g. Vantage / MT5" />
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className={labelCls}>Preferred next step</legend>
        <div className="flex flex-wrap gap-2">
          {NEXT_STEPS.map((step) => {
            const on = form.nextStep === step;
            return (
              <button type="button" key={step} onClick={() => set('nextStep', step)} aria-pressed={on}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                  on ? 'border-ink bg-ink text-on-dark' : 'border-line-strong bg-ivory text-ink-2 hover:border-ink-2 hover:text-ink'
                }`}>
                {on && <Check size={13} />}
                {step}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8">
        <label className={labelCls} htmlFor="message">Anything else?</label>
        <textarea id="message" rows={4} className={`${inputCls()} resize-y`} value={form.message}
          onChange={(e) => set('message', e.target.value)} placeholder="Goals, timeline, questions (optional)" />
      </div>

      <div className="mt-10 pt-8 border-t border-line flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-5">
        <p className="flex items-center gap-2 text-xs text-ink-3">
          <Info size={13} className="shrink-0" /> Demo form: no data is sent or stored in this build.
        </p>
        <button type="submit" className="btn btn-dark">
          Submit request <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}
