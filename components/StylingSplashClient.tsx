'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Nav from '@/components/Nav';

interface Props {
  filters?: { label: string; value: string; children?: any[] }[];
}

const stylingCategories = [
  { label: 'Commercials', value: 'Commercials', description: 'Brand & advertising work' },
  { label: 'Music Videos', value: 'Music Videos', description: 'Visual direction for artists' },
  { label: 'Editorial', value: 'Editorial', description: 'Print & digital editorial' },
];

export default function StylingSplashClient({ filters = [] }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: "'DM Sans', sans-serif" }}>
      <Nav filters={filters} />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '100px 24px 60px' : '120px 60px 80px',
        }}
      >
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)',
            marginBottom: '32px',
          }}
        >
          Styling
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: isMobile ? '42px' : 'clamp(52px, 7vw, 96px)',
            fontWeight: 400,
            color: '#0a0a0a',
            margin: '0 0 64px',
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            textAlign: 'center',
          }}
        >
          Select a category
        </motion.h1>

        {/* Category options */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '32px',
            alignItems: 'stretch',
          }}
        >
          {stylingCategories.map(({ label, value, description }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/work?filter=${encodeURIComponent(value)}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  padding: '40px 44px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  transition: 'border-color 0.3s, background 0.3s',
                  minWidth: isMobile ? '280px' : '200px',
                  cursor: 'pointer',
                  height: '100%',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: isMobile ? '28px' : '34px',
                    fontWeight: 400,
                    color: '#0a0a0a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    textAlign: 'center',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.35)',
                    textAlign: 'center',
                  }}
                >
                  {description}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>


      </div>
    </main>
  );
}