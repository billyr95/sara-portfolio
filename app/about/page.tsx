import { client } from '@/lib/sanity';
import { aboutPageQuery, workPageQuery } from '@/lib/queries';
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
  let filters = [];

  try {
    const [aboutData, workPageData] = await Promise.all([
      client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(workPageQuery, {}, { next: { revalidate: 60 } }),
    ]);
    data = aboutData;
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <AboutClient data={data} filters={filters} />;
}