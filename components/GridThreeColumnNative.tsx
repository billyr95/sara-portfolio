'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';

interface GridThreeColumnNativeProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  isLoaded: boolean;
}

function GridItem({
  project,
  index,
  onClick,
  isLoaded,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  isLoaded: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const isVideo = project.thumbnail.type === 'video';

  // Map aspectRatio to a CSS aspect-ratio value
  const aspectRatioMap: Record<string, string> = {
    '16:9': '16/9',
    '9:16': '9/16',
    '1:1': '1/1',
  };
  const aspectRatio = aspectRatioMap[project.aspectRatio] ?? '16/9';

  return (
    // Outer: centres the image vertically within the 300px row height
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
      }}
    >
      {/* Inner: sized by native aspect ratio, capped at 300px tall */}
      <article
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: '#e8e4de',
          // Maintain native ratio but never exceed 300px height
          aspectRatio,
          maxHeight: '300px',
          width: '100%',
          // If it's portrait/square the width will shrink; if landscape it'll fill width up to 300px tall
          maxWidth: '100%',
        }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={project.thumbnail.src}
            poster={project.thumbnail.poster}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={project.thumbnail.src}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            loading="lazy"
          />
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            {(project.tags ?? []).slice(0, 2).map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '2px 6px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(14px, 1.5vw, 20px)',
              fontWeight: 400,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            {project.title}
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '3px 0 0' }}>
            {project.year}
          </p>
        </div>
      </article>
    </motion.div>
  );
}

export default function GridThreeColumnNative({ projects, onProjectClick, isLoaded }: GridThreeColumnNativeProps) {
  return (
    <div
      style={{
        display: 'grid',
        // 3 cols on desktop, 2 on tablet, 1 on mobile
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        width: '100%',
        padding: '0 40px',
        boxSizing: 'border-box',
        alignItems: 'start',
      }}
      className="grid-three-native"
    >
      <style>{`
        @media (max-width: 900px) {
          .grid-three-native {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 0 24px !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 560px) {
          .grid-three-native {
            grid-template-columns: 1fr !important;
            padding: 0 16px !important;
            gap: 16px !important;
          }
        }
      `}</style>
      {projects.map((project, index) => (
        <GridItem
          key={project._id}
          project={project}
          index={index}
          onClick={() => onProjectClick(project)}
          isLoaded={isLoaded}
        />
      ))}
    </div>
  );
}