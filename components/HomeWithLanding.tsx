'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Project } from '@/types';
import UnicornScene from 'unicornstudio-react/next';

export default function HomeWithLanding({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>

      {/* ── FIXED NAV ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 40px',
        }}
      >
        {/* Logo / wordmark via UnicornScene */}
        <div style={{ width: '160px', height: '52px' }}>
          <UnicornScene
            projectId="KBn7vDUSJdNibc47UYOd"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.3/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
          />
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[
            { label: 'Work', href: '/#work' },
            { label: 'Contact', href: 'mailto:hello@saralukaszewski.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: '#0a0a0a',
                textDecoration: 'none',
                fontWeight: 500,
                opacity: 0.6,
                transition: 'opacity 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '1')}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '0.6')}
            >
              {label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── HERO LANDING ──────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
            minHeight: 'calc(100vh - 40px)',
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Gradient overlay for text legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 80%)',
            }}
          />

          {/* Bottom-left text (mirroring reference screenshot) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: '52px',
              left: '52px',
            }}
          >
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(32px, 5.5vw, 76px)',
                fontWeight: 700,
                color: '#f5f0e8',
                margin: '0 0 10px 0',
                lineHeight: 1.06,
                letterSpacing: '-0.025em',
              }}
            >
              Creative Direction,
              <br />
              Costume &amp; Film
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(14px, 1.6vw, 19px)',
                fontWeight: 400,
                color: 'rgba(245,240,232,0.72)',
                margin: 0,
                letterSpacing: '0.01em',
              }}
            >
              Visual storytelling through clothing, movement &amp; light
            </p>
          </motion.div>

          {/* Bottom-right CTA pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', bottom: '58px', right: '52px' }}
          >
            <a
              href="#work"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 28px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.26)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background-color 0.25s',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(255,255,255,0.26)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(255,255,255,0.14)';
              }}
            >
              View Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── WORK / PORTFOLIO GRID ─────────────────────────── */}
      <section
        id="work"
        style={{
          backgroundColor: '#ffffff',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* Section label */}
        <div
          style={{
            paddingLeft: '40px',
            paddingRight: '40px',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              color: '#0a0a0a',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Selected Work
          </h2>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              opacity: 0.35,
              fontWeight: 500,
            }}
          >
            {projects.length} projects
          </span>
        </div>

        {/* Grid */}
        <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          {projects.length > 0 ? (
            <PortfolioGrid
              projects={projects}
              onProjectClick={setSelectedProject}
              isLoaded={isLoaded}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 0',
                color: '#999',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <p style={{ fontSize: '16px' }}>No projects yet.</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>
                Add projects in{' '}
                <a href="/studio" style={{ textDecoration: 'underline', color: '#666' }}>
                  Sanity Studio
                </a>
              </p>
            </div>
          )}
        </div>
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