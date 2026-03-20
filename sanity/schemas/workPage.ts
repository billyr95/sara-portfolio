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
      description: 'Controls the filter buttons on the work page.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Filter Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'children',
              title: 'Sub-filters',
              type: 'array',
              description: 'Optional subcategories shown in a nested dropdown',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'value', title: 'Value', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'value' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
      initialValue: [
        { label: 'Creative Direction', value: 'Creative Direction', children: [] },
        {
          label: 'Film',
          value: 'Film',
          children: [
            { label: 'Feature Films', value: 'Feature Films' },
            { label: 'Short Films', value: 'Short Films' },
          ],
        },
        {
          label: 'Styling',
          value: 'Styling',
          children: [
            { label: 'Commercials', value: 'Commercials' },
            { label: 'Music Videos', value: 'Music Videos' },
            { label: 'Editorial', value: 'Editorial' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Work Page', subtitle: 'Filter settings' };
    },
  },
});