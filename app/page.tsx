import { client } from '@/lib/sanity';
import { homePageQuery, workPageQuery } from '@/lib/queries';
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
  let filters = [];

  try {
    const [homeData, workPageData] = await Promise.all([
      client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(workPageQuery, {}, { next: { revalidate: 60 } }),
    ]);
    data = homeData;
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <HomeWithLanding data={data} filters={filters} />;
}