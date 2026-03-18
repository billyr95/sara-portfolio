'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Project } from '@/types';
import Link from 'next/link';

interface Filter {
  label: string;
  value: string;
}

interface WorkClientProps {
  projects: Project[];
  filters: Filter[];
}

export default function WorkClient({ projects, filters }: WorkClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

      {/* ── STICKY NAV / FILTER BAR ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          transition: 'background-color 0.3s, border-color 0.3s',
        }}
      >
        {isMobile ? (
          /* ── MOBILE: two rows ── */
          <div>
            {/* Row 1: Sara ← → About */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                height: '52px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  opacity: 0.45,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sara
              </Link>
              <Link
                href="/about"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  opacity: 0.45,
                }}
              >
                About
              </Link>
            </div>
            {/* Row 2: scrollable filters */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 20px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch' as any,
                scrollbarWidth: 'none' as any,
                msOverflowStyle: 'none' as any,
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
            </div>
          </div>
        ) : (
          /* ── DESKTOP: single row ── */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
              padding: '0 40px',
            }}
          >
            {/* Back */}
            <Link
              href="/"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: '#0a0a0a',
                textDecoration: 'none',
                opacity: 0.4,
                transition: 'opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sara
            </Link>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {allFilters.map(({ label, value }) => {
                const isActive = activeFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setActiveFilter(value)}
                    style={{
                      padding: '7px 18px',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      color: isActive ? '#ffffff' : '#0a0a0a',
                      backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                      transition: 'color 0.2s, background-color 0.2s',
                      outline: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* About + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link
                href="/about"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  opacity: 0.4,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.4')}
              >
                About
              </Link>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  color: '#0a0a0a',
                  opacity: 0.35,
                }}
              >
                {filteredProjects.length} {filteredProjects.length === 1 ? 'work' : 'works'}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── GRID ──────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '16px 16px 60px' : '24px 40px 80px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filteredProjects.length > 0 ? (
              <PortfolioGrid
                projects={filteredProjects}
                onProjectClick={setSelectedProject}
                isLoaded={isLoaded}
              />
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

      {/* ── MODAL ─────────────────────────────────────────── */}
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