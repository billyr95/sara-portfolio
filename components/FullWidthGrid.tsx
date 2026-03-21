'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';

interface FullWidthGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  isLoaded: boolean;
}

function FullWidthItem({
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#e8e4de',
        display: 'block',
      }}
    >
      {project.thumbnail.type === 'video' ? (
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
          padding: '24px 28px',
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          opacity: isHovered ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          {(project.tags ?? []).slice(0, 2).map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(0,0,0,0.3)',
                padding: '3px 8px',
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
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 400,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)',
            margin: '4px 0 0',
          }}
        >
          {project.year}
        </p>
      </div>
    </motion.article>
  );
}

export default function FullWidthGrid({ projects, onProjectClick, isLoaded }: FullWidthGridProps) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {projects.map((project, index) => (
        <FullWidthItem
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