import { client } from '@/lib/sanity';
import { workPageQuery } from '@/lib/queries';
import FilmSplashClient from '@/components/FilmSplashClient';

export default async function FilmPage() {
  let filters = [];
  try {
    const workPageData = await client.fetch(workPageQuery, {}, { next: { revalidate: 60 } });
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }
  return <FilmSplashClient filters={filters} />;
}