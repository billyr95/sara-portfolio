import { defineType, defineField } from 'sanity';
import { FocalPointInput } from '../components/FocalPointInput';

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

    // ── THUMBNAIL — Cloudinary asset (image or video) ────────────────────
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      description: 'Pick an image or video from Cloudinary. Videos autoplay muted on the grid.',
      type: 'cloudinary.asset',
      validation: (Rule) => Rule.required(),
    }),

    // ── FOCAL POINT — controls object-position in the grid ───────────────
    defineField({
      name: 'thumbnailFocalPoint',
      title: 'Thumbnail Focal Point',
      description: 'Controls where the image is anchored inside its box on the grid.',
      type: 'string',
      initialValue: 'center',
      components: {
        input: FocalPointInput,
      },
    }),

    // ── MODAL MEDIA GALLERY — Cloudinary assets ──────────────────────────
    defineField({
      name: 'media',
      title: 'Media Gallery',
      description: 'Shown inside the project modal. Pick images or videos from Cloudinary.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaCloudinary',
          title: 'Cloudinary Asset',
          fields: [
            defineField({
              name: 'asset',
              title: 'Asset',
              type: 'cloudinary.asset',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { asset: 'asset' },
            prepare({ asset }: { asset: any }) {
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
    select: { title: 'title', subtitle: 'year' },
  },
});