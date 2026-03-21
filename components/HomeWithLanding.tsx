'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';
import Nav from '@/components/Nav';

interface Props {
  data: any;
  filters?: { label: string; value: string; children?: any[] }[];
}

const disciplines = [
  { label: 'Creative Direction', value: 'Creative Direction', href: '/work?filter=Creative+Direction' },
  { label: 'Film', value: 'Film', href: '/work/film' },
  { label: 'Styling', value: 'Styling', href: '/work/styling' },
];

const PROJECT_ID = '7DGpovGYmyRh48tmZ74w';
const SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';

export default function HomeWithLanding({ data, filters = [] }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <main
      style={{
        height: '100dvh',
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Nav filters={filters} />

      {/* Unicorn Studio Scene — full bleed */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <UnicornScene
          projectId={PROJECT_ID}
          sdkUrl={SDK_URL}
          width="100%"
          height="100%"
        />
      </div>

      {/* Discipline links — overlaid on the scene */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: isMobile ? '62%' : '68%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '20px' : '80px',
          padding: isMobile ? '0 32px' : '0',
        }}
      >
        {disciplines.map(({ label, href }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={href}
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: isMobile ? '28px' : 'clamp(36px, 4.5vw, 64px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#0a0a0a',
                textDecoration: 'none',
                opacity: 0.85,
                transition: 'opacity 0.25s, transform 0.25s',
                whiteSpace: 'nowrap',
                display: 'block',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.opacity = '0.85';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}