# SARA Portfolio

A dynamic visual portfolio built with Next.js 14, featuring an organic masonry grid with mixed aspect ratios (16:9, 9:16, 1:1), autoplay videos, and an immersive fullscreen modal.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Gap-free Masonry Grid**: 2D collision detection algorithm ensures zero white space
- **Mixed Aspect Ratios**: Supports 16:9 (landscape), 9:16 (portrait), and 1:1 (square)
- **Autoplay Videos**: Efficient MP4/WebM videos autoplay muted on load
- **Immersive Modal**: Fullscreen takeover with keyboard navigation and project details
- **Responsive**: Adapts grid density based on viewport width

## Project Structure

```
portfolio/
├── app/
│   ├── globals.css      # Global styles + fonts
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page with mock data
├── components/
│   ├── PortfolioGrid.tsx  # Masonry grid with layout algorithm
│   └── ProjectModal.tsx   # Fullscreen project viewer
├── types/
│   └── index.ts         # TypeScript interfaces
└── ...config files
```

## Connecting to Sanity

Replace the mock data in `app/page.tsx` with a Sanity fetch:

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Fetch projects
const projects = await client.fetch(`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    aspectRatio,
    thumbnail { type, "src": video.asset->url, "poster": poster.asset->url },
    media[] { type, "src": coalesce(video.asset->url, image.asset->url) },
    tags,
    year
  }
`);
```

## Customizing the Grid

In `PortfolioGrid.tsx`:

- **Base unit size**: Adjust `baseUnit` in the `useMemo` call (default: 220px desktop)
- **Column spans**: Modify logic in `calculateLayout` for how aspect ratios map to column widths
- **Animation timing**: Change `delay` values in GridItem motion props

## Adding the 3D Logo

The header currently has a text placeholder for "SARA". To add a Three.js 3D chrome logo:

1. Install Three.js: `npm install three @types/three`
2. Create a `MetallicLogo.tsx` component using TubeGeometry for smooth organic letters
3. Import and replace the text in `app/page.tsx`

## License

MIT
