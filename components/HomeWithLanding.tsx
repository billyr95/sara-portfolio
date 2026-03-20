'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import UnicornScene from 'unicornstudio-react/next';
import Nav from '@/components/Nav';

interface SubFilter {
  label: string;
  value: string;
}

interface Discipline {
  label: string;
  value: string;
  children?: SubFilter[];
}

interface Props {
  data: any;
  filters?: { label: string; value: string; children?: SubFilter[] }[];
}

const disciplines: Discipline[] = [
  { label: 'Creative Direction', value: 'Creative Direction' },
  {
    label: 'Film',
    value: 'Film',
    children: [
      { label: 'Feature Films', value: 'Feature Films' },
      { label: 'Short Films', value: 'Short Films' },
    ],
  },
  {
    label: 'Styling',
    value: 'Styling',
    children: [
      { label: 'Commercials', value: 'Commercials' },
      { label: 'Music Videos', value: 'Music Videos' },
      { label: 'Editorial', value: 'Editorial' },
    ],
  },
];

export default function HomeWithLanding({ data, filters = [] }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  // which discipline sub-menu is open (by value)
  const [openSub, setOpenSub] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMouseEnter = (value: string, hasChildren: boolean) => {
    if (!hasChildren || isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenSub(value);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => setOpenSub(null), 120);
  };

  const handleSubMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const toggle = (value: string) => {
    setOpenSub((prev) => (prev === value ? null : value));
  };

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
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
        {isMobile ? (
          <UnicornScene
            projectId="Y5ffBsrKKBamRXBo5d4s"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
          />
        ) : (
          <UnicornScene
            projectId="KBn7vDUSJdNibc47UYOd"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
          />
        )}
      </div>

      {/* Discipline links — overlaid on the scene */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: isMobile ? '68%' : '72%',
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
        {disciplines.map(({ label, value, children }) => {
          const hasChildren = !!children && children.length > 0;
          const isOpen = openSub === value;

          return (
            <div
              key={value}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onMouseEnter={() => handleMouseEnter(value, hasChildren)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Mobile: tap button to toggle; Desktop: plain link */}
              {isMobile && hasChildren ? (
                <button
                  onClick={() => toggle(value)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    opacity: 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {label}
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
                  >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <Link
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                >
                  {label}
                  {hasChildren && (
                    <svg
                      width="12" height="12" viewBox="0 0 10 10" fill="none"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', opacity: 0.6 }}
                    >
                      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
              )}

              {/* Mobile: animated tap-to-expand dropdown */}
              {isMobile && hasChildren && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}
                    >
                      {children!.map((child) => (
                        <Link
                          key={child.value}
                          href={`/work?filter=${encodeURIComponent(child.value)}`}
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '11px',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: '#0a0a0a',
                            textDecoration: 'none',
                            opacity: 0.4,
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Desktop sub-menu drops down */}
              {!isMobile && hasChildren && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={handleSubMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(255,255,255,0.96)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                        padding: '6px',
                        minWidth: '180px',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      {children!.map((child) => (
                        <Link
                          key={child.value}
                          href={`/work?filter=${encodeURIComponent(child.value)}`}
                          style={{
                            display: 'block',
                            padding: '9px 16px',
                            borderRadius: '8px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '11px',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: '#0a0a0a',
                            textDecoration: 'none',
                            opacity: 0.65,
                            transition: 'background 0.15s, opacity 0.15s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
                            e.currentTarget.style.opacity = '1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.opacity = '0.65';
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}


            </div>
          );
        })}
      </motion.div>
    </main>
  );
}