'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';

interface AboutData {
  photoUrl?: string;
  bio?: string;
  email?: string;
}

interface Props {
  data: AboutData | null;
  filters?: { label: string; value: string }[];
}

const LOREM = `Sara Lukaszewski is a New York-based creative director, costume designer, and filmmaker with a decade of experience shaping visual narratives across fashion, film, and editorial. Her work lives at the intersection of clothing and movement — each project a study in how what we wear transforms how we exist in space. She has collaborated with artists, directors, and brands who share a commitment to images that linger. When she is not on set, she is sourcing, sketching, and finding beauty in the unexpected.`;

export default function AboutClient({ data, filters = [] }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const photo = data?.photoUrl;
  const bio = data?.bio || LOREM;
  const email = data?.email || 'hello@saralukaszewski.com';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: "'DM Sans', sans-serif" }}>
      <Nav filters={filters} />

      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: isMobile ? '80px 20px 60px' : '110px 40px 100px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '80px',
        alignItems: 'start',
      }}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 'auto' : '88px',
            borderRadius: '12px',
            overflow: 'hidden',
            aspectRatio: isMobile ? '4/3' : '3/4',
            backgroundColor: '#e8e4de',
          }}
        >
          {photo ? (
            <img src={photo} alt="Sara Lukaszewski" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.2)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Photo
            </div>
          )}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: isMobile ? '0' : '8px' }}
        >
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: isMobile ? '36px' : 'clamp(36px, 4vw, 58px)', fontWeight: 400, color: '#0a0a0a', margin: '0 0 24px', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Sara Lukaszewski
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: 1.8, color: '#0a0a0a', opacity: 0.75, margin: '0 0 40px', fontWeight: 400 }}>
            {bio}
          </p>
          <a
            href={`mailto:${email}`}
            style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#0a0a0a', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.3)', paddingBottom: '3px', transition: 'border-color 0.2s, opacity 0.2s', opacity: 0.6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#0a0a0a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(0,0,0,0.3)'; }}
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </main>
  );
}