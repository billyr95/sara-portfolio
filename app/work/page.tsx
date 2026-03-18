import { client } from '@/lib/sanity';
import { allProjectsQuery, workPageQuery } from '@/lib/queries';
import { Project } from '@/types';
import WorkClient from '@/components/WorkClient';

export default async function WorkPage() {
  let projects: Project[] = [];
  let filters: { label: string; value: string }[] = [];

  try {
    const [projectsData, workPageData] = await Promise.all([
      client.fetch(allProjectsQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(workPageQuery, {}, { next: { revalidate: 60 } }),
    ]);
    projects = projectsData || [];
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  // Fallback filters if Sanity doc not yet created
  if (!filters.length) {
    filters = [
      { label: 'Creative Direction', value: 'Creative Direction' },
      { label: 'Film', value: 'Film' },
      { label: 'Styling', value: 'Styling' },
    ];
  }

  return <WorkClient projects={projects} filters={filters} />;
}