'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';

interface NavLink {
  label: string;
  href: string;
}

interface HomePageData {
  backgroundVideoUrl?: string;
  backgroundVideoPosterUrl?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  navLinks?: NavLink[];
}

interface Props {
  data: HomePageData | null;
}

export default function HomeWithLanding({ data }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallbacks if Sanity doc not yet created
  const headline = data?.headline || 'Creative Direction, Costume & Film';
  const subheadline = data?.subheadline || 'Visual storytelling through clothing, movement & light';
  const ctaLabel = data?.ctaLabel || 'View Work';
  const ctaLink = data?.ctaLink || '/work';
  const navLinks = data?.navLinks || [
    { label: 'Work', href: '/work' },
    { label: 'Contact', href: 'mailto:hello@saralukaszewski.com' },
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
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
        <div style={{ width: '260px', height: '80px' }}>
          <UnicornScene
            projectId="KBn7vDUSJdNibc47UYOd"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.3/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
          />
        </div>

        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {navLinks.map(({ label, href }) => (
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

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        style={{
          height: '100vh',
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
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={data?.backgroundVideoPosterUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            {data?.backgroundVideoUrl && (
              <source src={data.backgroundVideoUrl} type="video/mp4" />
            )}
          </video>

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)',
            }}
          />

          {/* Bottom-left text */}
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
                whiteSpace: 'pre-line',
              }}
            >
              {headline}
            </h1>
            {subheadline && (
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
                {subheadline}
              </p>
            )}
          </motion.div>

          {/* Bottom-right CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', bottom: '58px', right: '52px' }}
          >
            <Link
              href={ctaLink}
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
                textTransform: 'uppercase' as const,
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
              {ctaLabel}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}