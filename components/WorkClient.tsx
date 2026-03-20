'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
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
          // Direct tag match
          if (p.tags?.includes(activeFilter)) return true;
          // Parent match — show if project has any child tag
          const childValues = parentMap[activeFilter];
          if (childValues) {
            return childValues.some((cv) => p.tags?.includes(cv));
          }
          return false;
        });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Nav filters={filters} />

      <section style={{ padding: isMobile ? '72px 16px 60px' : '80px 40px 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProjects.length > 0 ? (
              <PortfolioGrid
                projects={filteredProjects}
                onProjectClick={setSelectedProject}
                isLoaded={isLoaded}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'DM Sans', sans-serif", color: '#999' }}>
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