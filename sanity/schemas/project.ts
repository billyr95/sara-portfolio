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

    // ── THUMBNAIL — native Sanity uploads only ───────────────────────────
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

    // ── MODAL MEDIA GALLERY — native uploads + Cloudinary ───────────────
    defineField({
      name: 'media',
      title: 'Media Gallery',
      description: 'Shown inside the project modal. Use native uploads or pick from Cloudinary.',
      type: 'array',
      of: [
        // Native image upload
        {
          type: 'object',
          name: 'mediaImage',
          title: 'Image (upload)',
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
              return { title: 'Image (upload)', media };
            },
          },
        },

        // Native video upload
        {
          type: 'object',
          name: 'mediaVideo',
          title: 'Video (upload)',
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
              return { title: 'Video (upload)' };
            },
          },
        },

        // Cloudinary asset (images + videos via the plugin picker)
        {
          type: 'object',
          name: 'mediaCloudinary',
          title: 'Cloudinary Asset',
          fields: [
            defineField({
              name: 'asset',
              title: 'Cloudinary Asset',
              // 'cloudinary.asset' is the type registered by sanity-plugin-cloudinary
              type: 'cloudinary.asset',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              asset: 'asset',
            },
            prepare({ asset }) {
              const isVideo = asset?.resource_type === 'video';
              return {
                title: isVideo ? 'Video (Cloudinary)' : 'Image (Cloudinary)',
                subtitle: asset?.public_id ?? '',
              };
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
      options: {
        list: [
          { title: 'Creative Direction', value: 'Creative Direction' },
          { title: 'Film', value: 'Film' },
          { title: 'Film › Feature Films', value: 'Feature Films' },
          { title: 'Film › Short Films', value: 'Short Films' },
          { title: 'Styling', value: 'Styling' },
          { title: 'Styling › Commercials', value: 'Commercials' },
          { title: 'Styling › Music Videos', value: 'Music Videos' },
          { title: 'Styling › Editorial', value: 'Editorial' },
        ],
        layout: 'list',
      },
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