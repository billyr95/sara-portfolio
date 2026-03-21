'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import FullWidthGrid from '@/components/FullWidthGrid';
import GridThreeColumn from '@/components/GridThreeColumn';
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
  projects?: Project[];
  filters: Filter[];
}

// Full-width stack on all screens
const FULL_WIDTH_FILTERS = new Set([
  'Film',
  'Feature Films',
  'Short Films',
]);

// Full-width on mobile, 3-col grid on desktop
const THREE_COL_FILTERS = new Set([
  'Styling',
  'Commercials',
  'Music Videos',
]);

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

  const safeProjects: Project[] = Array.isArray(projects) ? projects : [];
  const safeFilters: Filter[] = Array.isArray(filters) ? filters : [];

  const [activeFilter, setActiveFilter] = useState<string>(urlFilter || 'ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    setActiveFilter(urlFilter || 'ALL');
  }, [urlFilter]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const t = setTimeout(() => {
      setIsLoaded(true);
      setGridKey((k) => k + 1);
    }, 120);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(t);
    };
  }, []);

  const parentMap = buildParentMap(safeFilters);

  const filteredProjects: Project[] =
    activeFilter === 'ALL'
      ? safeProjects
      : safeProjects.filter((p) => {
          if (p.tags?.includes(activeFilter)) return true;
          const childValues = parentMap[activeFilter];
          if (childValues) {
            return childValues.some((cv) => p.tags?.includes(cv));
          }
          return false;
        });

  const useFullWidth = activeFilter !== 'ALL' && FULL_WIDTH_FILTERS.has(activeFilter);
  const useThreeCol  = activeFilter !== 'ALL' && THREE_COL_FILTERS.has(activeFilter);
  const projectCount = filteredProjects.length;

  const renderGrid = () => {
    if (useFullWidth) {
      return (
        <FullWidthGrid
          projects={filteredProjects}
          onProjectClick={setSelectedProject}
          isLoaded={isLoaded}
        />
      );
    }

    if (useThreeCol) {
      // 3-col grid on desktop, full-width stack on mobile
      return isMobile ? (
        <FullWidthGrid
          projects={filteredProjects}
          onProjectClick={setSelectedProject}
          isLoaded={isLoaded}
        />
      ) : (
        <div style={{ padding: '0 40px' }}>
          <GridThreeColumn
            projects={filteredProjects}
            onProjectClick={setSelectedProject}
            isLoaded={isLoaded}
          />
        </div>
      );
    }

    // Mosaic
    return (
      <div key={gridKey}>
        <PortfolioGrid
          projects={filteredProjects}
          onProjectClick={setSelectedProject}
          isLoaded={isLoaded}
        />
      </div>
    );
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Nav filters={safeFilters} />

      <section style={{ padding: '0 0 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {projectCount > 0 ? renderGrid() : (
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