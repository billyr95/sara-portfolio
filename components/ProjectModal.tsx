'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, MediaItem } from '@/types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function MediaViewer({ item, isActive }: { item: MediaItem; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  if (item.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        className="max-w-full max-h-full object-contain"
        controls
        playsInline
        loop
      />
    );
  }

  return (
    <img
      src={item.src}
      alt=""
      className="max-w-full max-h-full object-contain"
      loading="lazy"
    />
  );
}

// Close button top position — same on mobile and desktop
const CLOSE_BTN_TOP = 80; // px — was 20px, moved down 60px
const CLOSE_BTN_SIZE = 44; // px
const CLOSE_BTN_RIGHT = 20; // px
const TITLE_TOP_PAD = CLOSE_BTN_TOP + CLOSE_BTN_SIZE + 20; // 144px

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tags = project.tags ?? [];
  const media = project.media ?? [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % media.length);
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new Event('scroll'));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, media.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
      }}
    >
      {/* ── Close button ── */}
      <motion.button
        onClick={onClose}
        aria-label="Close"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute',
          top: `${CLOSE_BTN_TOP}px`,
          right: `${CLOSE_BTN_RIGHT}px`,
          zIndex: 10,
          width: `${CLOSE_BTN_SIZE}px`,
          height: `${CLOSE_BTN_SIZE}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.07)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.13)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.07)')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round">
          <line x1="1" y1="1" x2="15" y2="15" />
          <line x1="15" y1="1" x2="1" y2="15" />
        </svg>
      </motion.button>

      {/* ── Prev / Next arrows ── */}
      {media.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveIndex((prev) => (prev - 1 + media.length) % media.length)}
            aria-label="Previous"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.07)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveIndex((prev) => (prev + 1) % media.length)}
            aria-label="Next"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.07)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </motion.button>
        </>
      )}

      {/* ── Scrollable body ── */}
      <div
        ref={contentRef}
        style={{ height: '100%', overflowY: 'auto', overscrollBehavior: 'contain' }}
      >
        {/* Title block — top padding clears the close button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{
            paddingTop: `${TITLE_TOP_PAD}px`,
            paddingBottom: '16px',
            paddingLeft: '24px',
            // right padding keeps text away from the close button on all viewports
            paddingRight: `${CLOSE_BTN_RIGHT + CLOSE_BTN_SIZE + 16}px`,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px 16px' }}>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 'clamp(26px, 5vw, 58px)',
                fontWeight: 400,
                color: '#0a0a0a',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {project.title}
            </h1>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                opacity: 0.38,
                flexShrink: 0,
              }}
            >
              {project.year}
            </span>
          </div>

          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    opacity: 0.45,
                    border: '1px solid rgba(0,0,0,0.18)',
                    padding: '3px 10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Hero media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px 32px',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '1152px',
              width: '100%',
              aspectRatio: '16/9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {media[activeIndex] && (
                  <MediaViewer item={media[activeIndex]} isActive={true} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Dot indicators */}
        {media.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingBottom: '24px' }}
          >
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  width: index === activeIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: index === activeIndex ? '#0a0a0a' : 'rgba(0,0,0,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  padding: 0,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Project info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ backgroundColor: '#f9f9f9', borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div style={{ maxWidth: '896px', margin: '0 auto', padding: '64px 24px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '48px',
                marginBottom: '64px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>About</h3>
                <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.75, margin: 0 }}>{project.description}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Details</h3>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#888', margin: 0 }}>
                  {[
                    { label: 'Format', value: project.aspectRatio },
                    { label: 'Media', value: `${media.length} items` },
                    { label: 'Category', value: tags[0] ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <dt>{label}</dt>
                      <dd style={{ color: '#0a0a0a', margin: 0 }}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>

            {media.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '24px' }}>Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveIndex(index);
                        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`View item ${index + 1}`}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        overflow: 'hidden',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        outline: index === activeIndex ? '2px solid #0a0a0a' : 'none',
                        outlineOffset: '2px',
                        opacity: index === activeIndex ? 1 : 0.5,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => { if (index !== activeIndex) e.currentTarget.style.opacity = '1'; }}
                      onMouseLeave={e => { if (index !== activeIndex) e.currentTarget.style.opacity = '0.5'; }}
                    >
                      {item.type === 'video' ? (
                        <video src={item.src} poster={item.poster} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                      ) : (
                        <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      )}
                      {item.type === 'video' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="black"><polygon points="2,0 12,6 2,12" /></svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}