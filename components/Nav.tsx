'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SubFilter {
  label: string;
  value: string;
}

interface Filter {
  label: string;
  value: string;
  children?: SubFilter[];
}

interface NavProps {
  filters?: Filter[];
  light?: boolean;
}

const DEFAULT_FILTERS: Filter[] = [
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

// Disciplines that have their own splash page
const SPLASH_ROUTES: Record<string, string> = {
  Film: '/work/film',
  Styling: '/work/styling',
};

export default function Nav({ filters, light = false }: NavProps) {
  const pathname = usePathname();
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workFilters: Filter[] = (filters?.length ? filters : DEFAULT_FILTERS).map((f) => ({
    ...f,
    children: f.children ?? [],
  }));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWorkOpen(false);
        setOpenSub(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setWorkOpen(false);
    setOpenSub(null);
  }, [pathname]);

  const textColor = '#0a0a0a';
  const textOpacity = 0.5;
  const bgColor = scrolled ? 'rgba(255,255,255,0.94)' : 'transparent';

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: textColor,
    textDecoration: 'none',
    fontWeight: active ? 500 : 400,
    opacity: active ? 1 : textOpacity,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  });

  const isWork = pathname === '/work';

  // Get the href for a filter — splash page if available, else /work?filter=
  const getFilterHref = (value: string) => {
    return SPLASH_ROUTES[value] ?? `/work?filter=${encodeURIComponent(value)}`;
  };

  const DesktopFilterItem = ({ f }: { f: Filter }) => {
    const hasChildren = f.children && f.children.length > 0;
    const isSubOpen = openSub === f.value;
    const topLevelHref = getFilterHref(f.value);

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            padding: '9px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onClick={() => hasChildren && setOpenSub(isSubOpen ? null : f.value)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {/* Parent label: always clickable to top-level href */}
          <Link
            href={topLevelHref}
            onClick={() => { setWorkOpen(false); setOpenSub(null); }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: '#0a0a0a',
              textDecoration: 'none',
              opacity: 0.75,
              flex: 1,
            }}
          >
            {f.label}
          </Link>
          {hasChildren && (
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transform: isSubOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, opacity: 0.4 }}
            >
              <path d="M2 3.5l3 3 3-3" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <AnimatePresence>
          {hasChildren && isSubOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {f.children!.map((child) => (
                <Link
                  key={child.value}
                  href={`/work?filter=${encodeURIComponent(child.value)}`}
                  onClick={() => { setWorkOpen(false); setOpenSub(null); }}
                  style={{
                    display: 'block',
                    padding: '8px 14px 8px 24px',
                    borderRadius: '8px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color: '#0a0a0a',
                    textDecoration: 'none',
                    opacity: 0.5,
                    transition: 'background 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.5';
                  }}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? '0 20px' : '0 40px',
          height: isMobile ? '56px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: bgColor,
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'background-color 0.3s, border-color 0.3s',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: isMobile ? '17px' : '19px',
            color: textColor,
            textDecoration: 'none',
            letterSpacing: '-0.015em',
            opacity: pathname === '/' ? 0 : 0.85,
            pointerEvents: pathname === '/' ? 'none' : 'auto',
            transition: 'opacity 0.2s',
          }}
        >
          Sara Lukaszewski
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setWorkOpen((o) => !o); setOpenSub(null); }}
                style={{
                  ...linkStyle(isWork),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => { if (!isWork) e.currentTarget.style.opacity = String(textOpacity); }}
              >
                Work
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transform: workOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                >
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {workOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 14px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      padding: '6px',
                      minWidth: '200px',
                      zIndex: 200,
                      overflow: 'visible',
                    }}
                  >
                    {workFilters.map((f) => (
                      <DesktopFilterItem key={f.value} f={f} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/about"
              style={linkStyle(pathname === '/about')}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => { if (pathname !== '/about') e.currentTarget.style.opacity = String(textOpacity); }}
            >
              About
            </Link>

            <Link
              href="/contact"
              style={linkStyle(pathname === '/contact')}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => { if (pathname !== '/contact') e.currentTarget.style.opacity = String(textOpacity); }}
            >
              Contact
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen((o) => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            aria-label="Menu"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: textColor, transformOrigin: 'center' }} />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: textColor }} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: textColor, transformOrigin: 'center' }} />
          </button>
        )}
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              backgroundColor: '#ffffff',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 40px',
              overflowY: 'auto',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '56px', cursor: 'pointer' }} onClick={() => setMobileOpen(false)} />

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em', opacity: pathname === '/' ? 1 : 0.35, lineHeight: 1.2 }}
              >
                Home
              </Link>

              {/* Creative Direction — goes straight to filtered work */}
              <Link
                href="/work?filter=Creative+Direction"
                style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em', opacity: 0.35, lineHeight: 1.2, display: 'block' }}
              >
                Creative Direction
              </Link>

              {/* Film — goes to splash page */}
              <Link
                href="/work/film"
                style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em', opacity: 0.35, lineHeight: 1.2, display: 'block' }}
              >
                Film
              </Link>
              <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px', marginBottom: '6px' }}>
                {[{ label: 'Feature Films', value: 'Feature Films' }, { label: 'Short Films', value: 'Short Films' }].map((child) => (
                  <Link
                    key={child.value}
                    href={`/work?filter=${encodeURIComponent(child.value)}`}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', textDecoration: 'none', opacity: 0.3, lineHeight: 1.6 }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>

              {/* Styling — goes to splash page */}
              <Link
                href="/work/styling"
                style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em', opacity: 0.35, lineHeight: 1.2, display: 'block' }}
              >
                Styling
              </Link>
              <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px', marginBottom: '6px' }}>
                {[{ label: 'Commercials', value: 'Commercials' }, { label: 'Music Videos', value: 'Music Videos' }, { label: 'Editorial', value: 'Editorial' }].map((child) => (
                  <Link
                    key={child.value}
                    href={`/work?filter=${encodeURIComponent(child.value)}`}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', textDecoration: 'none', opacity: 0.3, lineHeight: 1.6 }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>

              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em', opacity: pathname === href ? 1 : 0.35, lineHeight: 1.2 }}>
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}