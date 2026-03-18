import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ── BACKGROUND VIDEO ─────────────────────────────────
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Full-screen hero video (MP4 recommended)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundVideoPoster',
      title: 'Video Poster Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown while video loads — use a key frame from the video',
    }),

    // ── HEADLINE ─────────────────────────────────────────
    defineField({
      name: 'headline',
      title: 'Headline (H1)',
      type: 'string',
      description: 'Large text bottom-left of the video',
      initialValue: 'Creative Direction, Costume & Film',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      description: 'Smaller text beneath the headline',
      initialValue: 'Visual storytelling through clothing, movement & light',
      validation: (Rule) => Rule.max(120),
    }),

    // ── CTA BUTTON ───────────────────────────────────────
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'View Work',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/work',
      description: 'e.g. /work or https://...',
    }),

    // ── NAV ──────────────────────────────────────────────
    defineField({
      name: 'navLinks',
      title: 'Nav Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'e.g. /work or mailto:hello@example.com',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
      initialValue: [
        { label: 'Work', href: '/work' },
        { label: 'Contact', href: 'mailto:hello@saralukaszewski.com' },
      ],
    }),

    // ── SEO ──────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      initialValue: 'Sara Lukaszewski',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      initialValue: 'Creative Direction, Costume, and Film',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: title || 'Home Page', subtitle: 'Landing page settings' };
    },
  },
});