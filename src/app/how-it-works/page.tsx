import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import { PlainTerms } from '@/components/explain/PlainTerms';
import { Steps } from '@/components/explain/Steps';
import { Risks } from '@/components/explain/Risks';
import { Faq } from '@/components/explain/Faq';
import { Glossary } from '@/components/explain/Glossary';
import { WHAT_YOU_NEED, WHAT_WE_DO, HOW_IT_TRADES } from '@/content/explain';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'How Golden Teak Capital trades gold for you in your own broker account: the five steps, what you need, what we do, the numbers explained, and the risks.',
};

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-10';

const SECTIONS = [
  ['#steps', 'The five steps'],
  ['#need', 'What you need'],
  ['#trades', 'How GTC trades'],
  ['#numbers', 'The numbers'],
  ['#risks', 'Risks'],
  ['#faq', 'Questions'],
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="paper border-b border-line">
        <div className={`${container} pt-12 pb-14 lg:pt-16 lg:pb-16`}>
          <p className="eyebrow rise">How it works</p>
          <h1 className="mt-6 max-w-4xl font-display text-[46px] sm:text-[70px] leading-[0.98] tracking-[-0.025em] text-ink rise rise-1">
            Everything a first-timer <em className="text-gold-deep">needs to know.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 rise rise-2">
            Golden Teak Capital is a managed trading service. We run our GTC algorithm on a gold trading account that
            is in your name, at your broker. This page explains what that involves, what the numbers on this site
            mean, and what can go wrong. No prior knowledge assumed.
          </p>
          <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2 rise rise-3">
            {SECTIONS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-line-strong bg-ivory/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-2 hover:border-ink hover:text-ink transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* In plain terms */}
      <section className={`${container} py-20 lg:py-24`}>
        <SectionHeading eyebrow="In plain terms" title="Three things to hold onto." />
        <div className="mt-12">
          <PlainTerms />
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="bg-sand/60 border-y border-line scroll-mt-24">
        <div className={`${container} py-20 lg:py-24`}>
          <SectionHeading
            eyebrow="The five steps"
            title={
              <>
                From first call <em className="text-gold-deep">to first trade.</em>
              </>
            }
            description="Nothing happens on your account until you have opened it, funded it and granted us access yourself."
          />
          <div className="mt-12">
            <Steps layout="list" />
          </div>
        </div>
      </section>

      {/* What you need / what we do */}
      <section id="need" className={`${container} py-20 lg:py-24 scroll-mt-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { eyebrow: 'What you need', title: 'Four things, all simple.', items: WHAT_YOU_NEED },
            { eyebrow: 'What we do', title: 'Our side of the deal.', items: WHAT_WE_DO },
          ].map((block) => (
            <div key={block.title} className="card p-7 sm:p-10">
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl text-ink">{block.title}</h2>
              <ul className="mt-8 space-y-6">
                {block.items.map((it) => (
                  <li key={it.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{it.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{it.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How GTC trades */}
      <section id="trades" className="bg-sand/60 border-y border-line scroll-mt-24">
        <div className={`${container} py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12`}>
          <div className="lg:col-span-4">
            <p className="eyebrow">The strategy</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
              {HOW_IT_TRADES.title}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-5">
            {HOW_IT_TRADES.body.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-ink-2">
                {p}
              </p>
            ))}
            <Link href="/algos" className="link-gold !mt-8">
              See the three plans <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section id="numbers" className={`${container} py-20 lg:py-24 scroll-mt-24`}>
        <SectionHeading
          eyebrow="The numbers, explained"
          title={
            <>
              Every figure on this site, <em className="text-gold-deep">in plain language.</em>
            </>
          }
          description="Each number is shown with its plain name; the technical name is given here so you can look it up elsewhere."
        />
        <div className="mt-12 grid grid-cols-1 gap-16">
          <div>
            <h3 className="label mb-6">Words you will see</h3>
            <Glossary section="terms" />
          </div>
          <div>
            <h3 className="label mb-6">The performance figures</h3>
            <Glossary section="metrics" />
          </div>
        </div>
      </section>

      {/* Risks */}
      <section id="risks" className="bg-espresso text-on-dark scroll-mt-24">
        <div className={`${container} py-20 lg:py-24`}>
          <SectionHeading
            tone="dark"
            eyebrow="Risks, plainly"
            title={
              <>
                What can <em className="text-gold-soft">go wrong.</em>
              </>
            }
            description="Read these before you decide. If anything here is unclear, ask us on the call; we would rather explain than surprise you."
          />
          <div className="mt-12">
            <Risks tone="dark" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${container} py-20 lg:py-24 scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12`}>
        <div className="lg:col-span-4">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-4 font-display text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.015em] text-ink">
            Asked <em className="text-gold-deep">and answered.</em>
          </h2>
          <p className="mt-5 text-ink-2 leading-relaxed">Anything missing? Ask us directly and we will add it here.</p>
          <Link href="/contact" className="mt-8 link-gold">
            Ask a question <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="lg:col-span-8">
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className={`${container} pb-24`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-ink/80 pt-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Ready to talk? <em className="text-gold-deep">It is free.</em>
            </h2>
            <p className="mt-3 text-ink-2">Tell us what you can start with and we will recommend a plan.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn btn-dark">
              Get started <ArrowRight size={14} />
            </Link>
            <Link href="/algos" className="btn btn-outline">
              See the plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
