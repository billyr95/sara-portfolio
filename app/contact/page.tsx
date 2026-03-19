import { client } from '@/lib/sanity';
import { contactPageQuery, workPageQuery } from '@/lib/queries';
import ContactClient from '@/components/ContactClient';

export default async function ContactPage() {
  let data = null;
  let filters = [];

  try {
    const [contactData, workPageData] = await Promise.all([
      client.fetch(contactPageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(workPageQuery, {}, { next: { revalidate: 60 } }),
    ]);
    data = contactData;
    filters = workPageData?.filters || [];
  } catch (error) {
    console.error('Sanity fetch error:', error);
  }

  return <ContactClient data={data} filters={filters} />;
}