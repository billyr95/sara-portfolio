import { client } from '@/lib/sanity';
import { workPageQuery } from '@/lib/queries';
import StylingSplashClient from '@/components/StylingSplashClient';

export default async function StylingPage() {
  let filters = [];
  try {
    const workPageData = await client.fetch(workPageQuery, {}, { next: { revalidate: 60 } });
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }
  return <StylingSplashClient filters={filters} />;
}