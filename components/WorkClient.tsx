'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import Nav from '@/components/Nav';
import { Project } from '@/types';

interface Filter {
  label: string;
  value: string;
}

interface WorkClientProps {
  projects: Project[];
  filters: Filter[];
}

export default function WorkClient({ projects, filters }: WorkClientProps) {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('filter');

  const [activeFilter, setActiveFilter] = useState<string>(urlFilter || 'ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((p) => p.tags?.includes(activeFilter));

  const allFilters = [{ label: 'All', value: 'ALL' }, ...filters];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Nav filters={filters} />

      {/* ── FILTER BAR ────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: isMobile ? '56px' : '64px',
          zIndex: 40,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          transition: 'background-color 0.3s',
        }}
      >
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '10px 20px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch' as any,
              scrollbarWidth: 'none' as any,
              alignItems: 'center',
            }}
          >
            {allFilters.map(({ label, value }) => {
              const isActive = activeFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 16px',
                    borderRadius: '100px',
                    border: isActive ? 'none' : '1px solid rgba(0,0,0,0.12)',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color: isActive ? '#ffffff' : '#0a0a0a',
                    backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                    outline: 'none',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {label}
                </button>
              );
            })}
            <span style={{ flexShrink: 0, marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#0a0a0a', opacity: 0.3, paddingLeft: '12px' }}>
              {filteredProjects.length}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', padding: '0 40px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {allFilters.map(({ label, value }) => {
                const isActive = activeFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setActiveFilter(value)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      color: isActive ? '#ffffff' : '#0a0a0a',
                      backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                      transition: 'color 0.2s, background-color 0.2s',
                      outline: 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#0a0a0a', opacity: 0.3, letterSpacing: '0.06em' }}>
              {filteredProjects.length} {filteredProjects.length === 1 ? 'work' : 'works'}
            </span>
          </div>
        )}
      </div>

      {/* ── GRID ──────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '16px 16px 60px' : '24px 40px 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {filteredProjects.length > 0 ? (
              <PortfolioGrid projects={filteredProjects} onProjectClick={setSelectedProject} isLoaded={isLoaded} />
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'DM Sans', sans-serif", color: '#999' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>No projects in this category yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </main>
  );
}