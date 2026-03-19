'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';
import Nav from '@/components/Nav';

interface HomePageData {
  backgroundVideoUrl?: string;
  backgroundVideoPosterUrl?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

interface Props {
  data: HomePageData | null;
  filters?: { label: string; value: string }[];
}

export default function HomeWithLanding({ data, filters = [] }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const headline = data?.headline || 'Creative Direction, Costume & Film';
  const subheadline = data?.subheadline || 'Visual storytelling through clothing, movement & light';
  const ctaLabel = data?.ctaLabel || 'View Work';
  const ctaLink = data?.ctaLink || '/work';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  const pad = isMobile ? '12px' : '20px';

  return (
    <main style={{ height: '100dvh', backgroundColor: '#ffffff', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Shared nav — light=true so text is white over video */}
      <Nav filters={filters} light />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ height: '100dvh', display: 'flex', alignItems: 'stretch', padding: pad, boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', width: '100%', borderRadius: isMobile ? '16px' : '20px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay muted loop playsInline
            poster={data?.backgroundVideoPosterUrl}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            {data?.backgroundVideoUrl && <source src={data.backgroundVideoUrl} type="video/mp4" />}
          </video>

          {/* Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: isMobile
              ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)',
          }} />

          {/* Mobile: stacked bottom */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}
            >
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(28px, 8vw, 42px)', fontWeight: 700, color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {headline}
              </h1>
              {subheadline && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'rgba(245,240,232,0.7)', margin: '0 0 24px', lineHeight: 1.5 }}>
                  {subheadline}
                </p>
              )}
              <Link
                href={ctaLink}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.28)', color: '#ffffff', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
              >
                {ctaLabel}
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
          ) : (
            /* Desktop: text left, CTA right */
            <>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', bottom: '52px', left: '52px', maxWidth: '60%' }}
              >
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(32px, 5.5vw, 76px)', fontWeight: 700, color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.06, letterSpacing: '-0.025em', whiteSpace: 'pre-line' }}>
                  {headline}
                </h1>
                {subheadline && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1.6vw, 19px)', color: 'rgba(245,240,232,0.72)', margin: 0, letterSpacing: '0.01em' }}>
                    {subheadline}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', bottom: '58px', right: '52px' }}
              >
                <Link
                  href={ctaLink}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '13px 28px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.26)', color: '#ffffff', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, textDecoration: 'none', transition: 'background-color 0.25s', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.26)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.14)'; }}
                >
                  {ctaLabel}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}