import { client } from '@/lib/sanity';
import { aboutPageQuery } from '@/lib/queries';
import AboutClient from '@/components/AboutClient';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null);
  return {
    title: data?.seoTitle || 'About — Sara Lukaszewski',
    description: data?.seoDescription || '',
  };
}

export default async function AboutPage() {
  let data = null;
  try {
    data = await client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <AboutClient data={data} />;
}