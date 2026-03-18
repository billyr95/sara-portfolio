import { client } from '@/lib/sanity';
import { allProjectsQuery } from '@/lib/queries';
import { Project } from '@/types';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  let projects: Project[] = [];

  try {
    projects = await client.fetch(allProjectsQuery, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <HomeClient projects={projects} />;
}