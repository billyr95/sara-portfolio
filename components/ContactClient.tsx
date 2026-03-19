'use client';

import { motion } from 'framer-motion';
import Nav from '@/components/Nav';

interface ContactData {
  heading?: string;
  subheading?: string;
  email?: string;
  instagramHandle?: string;
  extraLinks?: { label: string; url: string }[];
}

interface Props {
  data: ContactData | null;
  filters: { label: string; value: string }[];
}

export default function ContactClient({ data, filters }: Props) {
  const heading = data?.heading || 'Get in touch';
  const subheading = data?.subheading || 'Available for freelance, collaboration & commissions';
  const email = data?.email || 'hello@saralukaszewski.com';
  const instagram = data?.instagramHandle;
  const extraLinks = data?.extraLinks || [];

  const links = [
    { label: 'Email', href: `mailto:${email}`, display: email },
    ...(instagram ? [{ label: 'Instagram', href: `https://instagram.com/${instagram}`, display: `@${instagram}` }] : []),
    ...extraLinks.map(l => ({ label: l.label, href: l.url, display: l.url.replace(/^https?:\/\//, '') })),
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Nav filters={filters} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(100px, 15vw, 160px) clamp(24px, 8vw, 120px) 80px',
          maxWidth: '900px',
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(44px, 8vw, 96px)',
              fontWeight: 400,
              color: '#0a0a0a',
              margin: '0 0 16px',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
            }}
          >
            {heading}
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: '#0a0a0a',
              opacity: 0.45,
              margin: '0 0 64px',
              letterSpacing: '0.01em',
              fontWeight: 400,
            }}
          >
            {subheading}
          </p>
        </motion.div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {links.map(({ label, href, display }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                textDecoration: 'none',
                color: '#0a0a0a',
                transition: 'opacity 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity: 0.4,
                  fontWeight: 400,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 'clamp(18px, 3vw, 28px)',
                  letterSpacing: '-0.01em',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {display}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}