'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Nav from '@/components/Nav';

interface Props {
  filters?: { label: string; value: string; children?: any[] }[];
}

const filmCategories = [
  { label: 'Feature Films', value: 'Feature Films' },
  { label: 'Short Films', value: 'Short Films' },
];

export default function FilmSplashClient({ filters = [] }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Nav filters={filters} />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? '24px' : '80px',
          }}
        >
          {filmCategories.map(({ label, value }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/work?filter=${encodeURIComponent(value)}`}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: isMobile ? 'clamp(36px, 10vw, 56px)' : 'clamp(36px, 6vw, 80px)',
                  fontWeight: 400,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}