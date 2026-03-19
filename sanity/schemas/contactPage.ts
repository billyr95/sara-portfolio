import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      initialValue: 'Available for freelance, collaboration & commissions',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      initialValue: 'hello@saralukaszewski.com',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ symbol',
    }),
    defineField({
      name: 'extraLinks',
      title: 'Extra Links',
      type: 'array',
      description: 'Any other links — Substack, IMDb, etc.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page' };
    },
  },
});