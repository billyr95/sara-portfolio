'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  forceLight?: boolean; // always use dark text, skip brightness sampling
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

const SPLASH_ROUTES: Record<string, string> = {
  Film: '/work/film',
  Styling: '/work/styling',
};

function sampleNavBrightness(navHeight: number): number {
  try {
    const sampleY = Math.floor(navHeight / 2);
    const points = [0.1, 0.25, 0.5, 0.75, 0.9];
    let totalBrightness = 0;
    let samples = 0;

    const navEl = document.querySelector('nav') as HTMLElement | null;
    if (navEl) navEl.style.visibility = 'hidden';

    for (const xRatio of points) {
      const x = Math.floor(window.innerWidth * xRatio);
      const el = document.elementFromPoint(x, sampleY) as HTMLElement | null;

      if (!el) continue;

      const tagName = el.tagName.toLowerCase();
      if (tagName === 'video' || tagName === 'img' || tagName === 'canvas') {
        totalBrightness += 30;
        samples++;
        continue;
      }

      let target: HTMLElement | null = el;
      let bgColor = 'rgba(0,0,0,0)';

      while (target && target !== document.body) {
        const style = window.getComputedStyle(target);
        const bg = style.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          bgColor = bg;
          break;
        }
        const bgImg = style.backgroundImage;
        if (bgImg && bgImg !== 'none') {
          bgColor = 'rgb(30,30,30)';
          break;
        }
        target = target.parentElement;
      }

      const match = bgColor.match(/[\d.]+/g);
      if (match && match.length >= 3) {
        const r = parseFloat(match[0]);
        const g = parseFloat(match[1]);
        const b = parseFloat(match[2]);
        totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
        samples++;
      }
    }

    if (navEl) navEl.style.visibility = '';

    return samples > 0 ? totalBrightness / samples : 255;
  } catch {
    return 255;
  }
}

export default function Nav({ filters, forceLight }: NavProps) {
  const pathname = usePathname();
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const workFilters: Filter[] = (filters?.length ? filters : DEFAULT_FILTERS).map((f) => ({
    ...f,
    children: f.children ?? [],
  }));

  const checkBrightness = useCallback(() => {
    const navHeight = isMobile ? 56 : 64;
    const brightness = sampleNavBrightness(navHeight);
    setIsDark(brightness < 140);
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(checkBrightness);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t1 = setTimeout(checkBrightness, 100);
    const t2 = setTimeout(checkBrightness, 600);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [checkBrightness]);

  useEffect(() => {
    const t = setTimeout(checkBrightness, 200);
    return () => clearTimeout(t);
  }, [pathname, checkBrightness]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const textColor = (forceLight || !isDark) ? '#0a0a0a' : '#ffffff';
  const textOpacity = 0.6;
  const barColor = (forceLight || !isDark) ? '#0a0a0a' : '#ffffff';

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: textColor,
    textDecoration: 'none',
    fontWeight: active ? 500 : 400,
    opacity: active ? 1 : textOpacity,
    transition: 'color 0.3s, opacity 0.2s',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  });

  const isWork = pathname === '/work';

  const getFilterHref = (value: string) =>
    SPLASH_ROUTES[value] ?? `/work?filter=${encodeURIComponent(value)}`;

  const DesktopFilterItem = ({ f }: { f: Filter }) => {
    const hasChildren = f.children && f.children.length > 0;
    const isSubOpen = openSub === f.value;

    return (
      <div>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '6px', padding: '9px 14px', borderRadius: '8px',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onClick={() => hasChildren && setOpenSub(isSubOpen ? null : f.value)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Link
            href={getFilterHref(f.value)}
            onClick={() => { setWorkOpen(false); setOpenSub(null); }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              color: '#0a0a0a', textDecoration: 'none', opacity: 0.75, flex: 1,
            }}
          >
            {f.label}
          </Link>
          {hasChildren && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transform: isSubOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, opacity: 0.4 }}>
              <path d="M2 3.5l3 3 3-3" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <AnimatePresence>
          {hasChildren && isSubOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {f.children!.map((child) => (
                <Link key={child.value} href={`/work?filter=${encodeURIComponent(child.value)}`}
                  onClick={() => { setWorkOpen(false); setOpenSub(null); }}
                  style={{
                    display: 'block', padding: '8px 14px 8px 24px', borderRadius: '8px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                    letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                    color: '#0a0a0a', textDecoration: 'none', opacity: 0.5,
                    transition: 'background 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.opacity = '0.5'; }}
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
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 102,
          padding: isMobile ? '0 20px' : '0 40px',
          height: isMobile ? '56px' : '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'transparent',
          transition: 'background-color 0.3s',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: isMobile ? '17px' : '19px',
            color: textColor, textDecoration: 'none', letterSpacing: '-0.015em',
            opacity: pathname === '/' ? 0 : 0.85,
            pointerEvents: pathname === '/' ? 'none' : 'auto',
            transition: 'color 0.3s, opacity 0.2s',
          }}
        >
          Sara Lukaszewski
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setWorkOpen((o) => !o); setOpenSub(null); }}
                style={{ ...linkStyle(isWork), display: 'flex', alignItems: 'center', gap: '5px' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => { if (!isWork) e.currentTarget.style.opacity = String(textOpacity); }}
              >
                Work
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transform: workOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <path d="M2 3.5l3 3 3-3" stroke={textColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {workOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 14px)', left: '50%',
                      transform: 'translateX(-50%)', backgroundColor: '#ffffff',
                      borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '6px',
                      minWidth: '200px', zIndex: 200,
                    }}
                  >
                    {workFilters.map((f) => <DesktopFilterItem key={f.value} f={f} />)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" style={linkStyle(pathname === '/about')}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => { if (pathname !== '/about') e.currentTarget.style.opacity = String(textOpacity); }}>
              About
            </Link>
            <Link href="/contact" style={linkStyle(pathname === '/contact')}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => { if (pathname !== '/contact') e.currentTarget.style.opacity = String(textOpacity); }}>
              Contact
            </Link>
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: mobileOpen ? 'rgba(0,0,0,0.06)' : 'none',
              border: 'none', cursor: 'pointer', padding: '10px',
              display: 'flex', flexDirection: 'column', gap: '5px',
              borderRadius: '50%', transition: 'background 0.2s',
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: barColor, transformOrigin: 'center', transition: 'background-color 0.3s' }} />
            <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: barColor, transition: 'background-color 0.3s' }} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{ display: 'block', width: '22px', height: '1.5px', backgroundColor: barColor, transformOrigin: 'center', transition: 'background-color 0.3s' }} />
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 101, backgroundColor: '#ffffff',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 40px', overflowY: 'auto',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'Creative Direction', href: '/work?filter=Creative+Direction' },
                { label: 'Film', href: '/work/film' },
                { label: 'Styling', href: '/work/styling' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => {
                const isActive = href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(href.split('?')[0]);
                return (
                  <Link key={href} href={href} style={{
                    fontFamily: "'Instrument Serif', serif", fontSize: '40px',
                    color: '#0a0a0a', textDecoration: 'none', letterSpacing: '-0.02em',
                    opacity: isActive ? 1 : 0.35, lineHeight: 1.2, display: 'block',
                    WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
                  }}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}