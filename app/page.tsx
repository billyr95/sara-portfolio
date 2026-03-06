'use client';

import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Project } from '@/types';
import UnicornScene from "unicornstudio-react/next";

// Mock data - replace with Sanity fetch
const mockProjects: Project[] = [
  {
    _id: '1',
    title: 'Hellstar Campaign',
    slug: 'hellstar-campaign',
    description: 'A visceral exploration of streetwear aesthetics and underground culture. Shot across three cities over two weeks, this campaign captures the raw energy of youth rebellion.',
    aspectRatio: '16:9',
    thumbnail: {
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-198-large.mp4',
      poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    },
    media: [
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-198-large.mp4' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200' },
    ],
    tags: ['Fashion', 'Campaign', 'Video'],
    year: '2024',
  },
  {
    _id: '2',
    title: 'Neon Dreams',
    slug: 'neon-dreams',
    description: 'An editorial series exploring the intersection of technology and humanity in modern urban environments.',
    aspectRatio: '9:16',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' },
    ],
    tags: ['Editorial', 'Portrait'],
    year: '2024',
  },
  {
    _id: '3',
    title: 'Studio Sessions',
    slug: 'studio-sessions',
    description: 'Intimate portraits captured in controlled studio environments. Each frame tells a story of vulnerability and strength.',
    aspectRatio: '1:1',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200' },
    ],
    tags: ['Portrait', 'Studio'],
    year: '2023',
  },
  {
    _id: '4',
    title: 'Motion Study',
    slug: 'motion-study',
    description: 'Exploring human movement through high-speed capture and post-production manipulation.',
    aspectRatio: '16:9',
    thumbnail: {
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4',
      poster: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    },
    media: [
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4' },
    ],
    tags: ['Sports', 'Motion'],
    year: '2024',
  },
  {
    _id: '5',
    title: 'Desert Mirage',
    slug: 'desert-mirage',
    description: 'A fashion story set against the stark beauty of the Mojave. Minimalism meets maximalist styling.',
    aspectRatio: '9:16',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200' },
    ],
    tags: ['Fashion', 'Landscape'],
    year: '2023',
  },
  {
    _id: '6',
    title: 'Urban Decay',
    slug: 'urban-decay',
    description: 'Finding beauty in abandoned spaces. A meditation on time, memory, and the impermanence of human creation.',
    aspectRatio: '1:1',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200' },
    ],
    tags: ['Architecture', 'Documentary'],
    year: '2024',
  },
  {
    _id: '7',
    title: 'Chromatic',
    slug: 'chromatic',
    description: 'An exploration of color theory through portraiture. Each image limited to a single dominant hue.',
    aspectRatio: '16:9',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200' },
    ],
    tags: ['Portrait', 'Experimental'],
    year: '2023',
  },
  {
    _id: '8',
    title: 'Night Shift',
    slug: 'night-shift',
    description: 'Documentary series following night workers across different industries. Real stories, real people.',
    aspectRatio: '9:16',
    thumbnail: {
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-white-lights-of-cars-on-the-street-of-a-city-4248-large.mp4',
      poster: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800',
    },
    media: [
      { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-white-lights-of-cars-on-the-street-of-a-city-4248-large.mp4' },
    ],
    tags: ['Documentary', 'Night'],
    year: '2024',
  },
  {
    _id: '9',
    title: 'Botanical',
    slug: 'botanical',
    description: 'Macro photography series examining the intricate patterns and textures found in plant life.',
    aspectRatio: '1:1',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200' },
    ],
    tags: ['Nature', 'Macro'],
    year: '2023',
  },
  {
    _id: '10',
    title: 'Concrete Jungle',
    slug: 'concrete-jungle',
    description: 'Urban architecture series exploring geometric patterns in city landscapes.',
    aspectRatio: '16:9',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200' },
    ],
    tags: ['Architecture', 'Urban'],
    year: '2024',
  },
  {
    _id: '11',
    title: 'Silk Road',
    slug: 'silk-road',
    description: 'Fashion meets cultural heritage in this East-meets-West editorial.',
    aspectRatio: '9:16',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200' },
    ],
    tags: ['Fashion', 'Culture'],
    year: '2023',
  },
  {
    _id: '12',
    title: 'Monochrome',
    slug: 'monochrome',
    description: 'Black and white portrait series exploring light, shadow, and form.',
    aspectRatio: '1:1',
    thumbnail: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    media: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' },
    ],
    tags: ['Portrait', 'B&W'],
    year: '2024',
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center justify-center px-6 py-8">
<div className="w-96 h-32 flex items-center justify-center">
  <UnicornScene 
    projectId="KBn7vDUSJdNibc47UYOd" 
    sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.1/dist/unicornStudio.umd.js"
    width="100%" 
    height="100%" 
  />
</div>
        </div>
        {/* Nav */}
        <nav className="absolute top-8 right-6 hidden md:flex items-center gap-8 text-sm tracking-wide text-neutral-600">
          <a href="#work" className="hover:text-neutral-900 transition-colors">Work</a>
          <a href="#about" className="hover:text-neutral-900 transition-colors">About</a>
          <a href="#contact" className="hover:text-neutral-900 transition-colors">Contact</a>
        </nav>
        <button className="absolute top-8 right-6 md:hidden text-neutral-600">
          <span className="sr-only">Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </motion.header>

      {/* Grid */}
      <section id="work" className="pt-32">
        <PortfolioGrid 
          projects={mockProjects} 
          onProjectClick={setSelectedProject}
          isLoaded={isLoaded}
        />
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
