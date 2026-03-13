import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Landscape (16:9)', value: '16:9' },
          { title: 'Portrait (9:16)', value: '9:16' },
          { title: 'Square (1:1)', value: '1:1' },
        ],
        layout: 'radio',
      },
      initialValue: '16:9',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnailType',
      title: 'Thumbnail Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.thumbnailType !== 'image',
    }),
    defineField({
      name: 'thumbnailVideo',
      title: 'Thumbnail Video',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.thumbnailType !== 'video',
    }),
    defineField({
      name: 'thumbnailPoster',
      title: 'Thumbnail Poster (shown while video loads)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.thumbnailType !== 'video',
    }),
    defineField({
      name: 'media',
      title: 'Media Gallery',
      description: 'Images and videos shown when project is opened',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { media: 'image' },
            prepare({ media }) {
              return { title: 'Image', media };
            },
          },
        },
        {
          type: 'object',
          name: 'mediaVideo',
          title: 'Video',
          fields: [
            defineField({
              name: 'video',
              title: 'Video',
              type: 'file',
              options: { accept: 'video/*' },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            prepare() {
              return { title: 'Video' };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (10, 20, 30...)',
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'year', media: 'thumbnailImage' },
  },
});