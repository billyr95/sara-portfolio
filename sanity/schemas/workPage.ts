import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'workPage',
  title: 'Work Page',
  type: 'document',
  fields: [
    defineField({
      name: 'filters',
      title: 'Filter Categories',
      type: 'array',
      description: 'Controls the filter buttons on the work page. "All" is always added automatically.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button Label',
              type: 'string',
              description: 'e.g. Creative Direction, Film, Styling',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Filter Value',
              type: 'string',
              description: 'Must match the tag used on projects exactly (case-sensitive)',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      initialValue: [
        { label: 'Creative Direction', value: 'Creative Direction' },
        { label: 'Film', value: 'Film' },
        { label: 'Styling', value: 'Styling' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Work Page', subtitle: 'Filter settings' };
    },
  },
});