'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import FullWidthGrid from './FullWidthGrid';
import Nav from '@/components/Nav';
import { Project } from '@/types';

interface SubFilter {
  label: string;
  value: string;
}

interface Filter {
  label: string;
  value: string;
  children?: SubFilter[];
}

interface WorkClientProps {
  projects: Project[];
  filters: Filter[];
}

// Filters that should display as full-width 16:9 — everything except Creative Direction and Editorial
const FULL_WIDTH_FILTERS = new Set([
  'Film',
  'Feature Films',
  'Short Films',
  'Styling',
  'Commercials',
  'Music Videos',
]);

// Map every parent value → its children's values so filtering Film also
// shows Feature Films + Short Films projects
function buildParentMap(filters: Filter[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const f of filters) {
    if (f.children && f.children.length > 0) {
      map[f.value] = f.children.map((c) => c.value);
    }
  }
  return map;
}

export default function WorkClient({ projects, filters }: WorkClientProps) {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('filter');

  const [activeFilter, setActiveFilter] = useState<string>(urlFilter || 'ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setActiveFilter(urlFilter || 'ALL');
  }, [urlFilter]);

  useEffect(() => {
    setIsLoaded(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const parentMap = buildParentMap(filters);

  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((p) => {
          if (p.tags?.includes(activeFilter)) return true;
          const childValues = parentMap[activeFilter];
          if (childValues) {
            return childValues.some((cv) => p.tags?.includes(cv));
          }
          return false;
        });

  // Determine layout: full-width 16:9 or mosaic
  const useFullWidth = activeFilter !== 'ALL' && FULL_WIDTH_FILTERS.has(activeFilter);

  // Page title for filtered views
  const getPageTitle = () => {
    if (activeFilter === 'ALL') return null;
    return activeFilter;
  };

  const pageTitle = getPageTitle();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Nav filters={filters} />

      {/* Category heading for filtered views */}
      {pageTitle && (
        <motion.div
          key={pageTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            paddingTop: isMobile ? '80px' : '90px',
            paddingLeft: isMobile ? '16px' : '40px',
            paddingRight: isMobile ? '16px' : '40px',
            paddingBottom: '0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '4px' }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: isMobile ? '32px' : 'clamp(32px, 4vw, 52px)',
                fontWeight: 400,
                color: '#0a0a0a',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}
            >
              {pageTitle}
            </h1>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'rgba(0,0,0,0.35)',
                letterSpacing: '0.05em',
              }}
            >
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </motion.div>
      )}

      <section
        style={{
          padding: pageTitle
            ? isMobile ? '24px 0 60px' : '32px 0 80px'
            : isMobile ? '72px 16px 60px' : '80px 40px 80px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProjects.length > 0 ? (
              useFullWidth ? (
                <FullWidthGrid
                  projects={filteredProjects}
                  onProjectClick={setSelectedProject}
                  isLoaded={isLoaded}
                />
              ) : (
                <div style={{ padding: pageTitle ? (isMobile ? '0 16px' : '0 40px') : '0' }}>
                  <PortfolioGrid
                    projects={filteredProjects}
                    onProjectClick={setSelectedProject}
                    isLoaded={isLoaded}
                  />
                </div>
              )
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#999',
                }}
              >
                <p style={{ fontSize: '15px', margin: 0 }}>No projects in this category yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}