'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';
import Nav from '@/components/Nav';

interface Props {
  data: any;
  filters?: { label: string; value: string }[];
}

const disciplines = [
  { label: 'Creative Direction', value: 'Creative Direction' },
  { label: 'Film', value: 'Film' },
  { label: 'Styling', value: 'Styling' },
];

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <UnicornScene
          projectId="KBn7vDUSJdNibc47UYOd"
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js"
          width="100%"
          height="100%"
        />
      </div>

      {/* Discipline links — overlaid on the scene */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: isMobile ? '72%' : '72%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '14px' : '64px',
        }}
      >
        {disciplines.map(({ label, value }) => (
          <Link
            key={value}
            href={`/work?filter=${encodeURIComponent(value)}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? '13px' : '22px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              textDecoration: 'none',
              opacity: 0.6,
              transition: 'opacity 0.25s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          >
            {label}
          </Link>
        ))}
      </motion.div>
    </main>
  );
}