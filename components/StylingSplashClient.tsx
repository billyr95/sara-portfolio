'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Nav from '@/components/Nav';

interface Props {
  filters?: { label: string; value: string; children?: any[] }[];
}

const stylingCategories = [
  { label: 'Commercials', value: 'Commercials' },
  { label: 'Music Videos', value: 'Music Videos' },
  { label: 'Editorial', value: 'Editorial' },
];

export default function StylingSplashClient({ filters = [] }: Props) {
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
          gap: '24px',
        }}
      >
        {stylingCategories.map(({ label, value }, i) => (
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
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 400,
                color: '#0a0a0a',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                opacity: 0.85,
                transition: 'opacity 0.2s',
                display: 'block',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}