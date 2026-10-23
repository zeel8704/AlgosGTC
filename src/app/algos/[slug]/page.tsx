import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStrategy, ALGO_SLUGS } from '@/data/strategies';
import { AlgoDetail } from '@/components/AlgoDetail';

// Params are read in this server page outside a Suspense boundary; the slug set
// is static (generateStaticParams), so we let the route block on the server.
export const instant = false;

export function generateStaticParams() {
  return ALGO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getStrategy(slug);
  if (!s) return { title: 'Strategy' };
  return {
    title: s.config.name,
    description: `${s.config.tagline}. ${s.config.direction} XAUUSD strategy, backtested ${s.config.testPeriod.startDate} to ${s.config.testPeriod.endDate}.`,
  };
}

export default async function AlgoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) notFound();
  return <AlgoDetail strategy={strategy} />;
}
