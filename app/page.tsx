import { client } from '@/lib/sanity';
import { homePageQuery } from '@/lib/queries';
import HomeWithLanding from '@/components/HomeWithLanding';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }).catch(() => null);
  return {
    title: data?.seoTitle || 'Sara Lukaszewski',
    description: data?.seoDescription || 'Creative Direction, Costume, and Film',
  };
}

export default async function Home() {
  let data = null;

  try {
    data = await client.fetch(homePageQuery, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <HomeWithLanding data={data} />;
}