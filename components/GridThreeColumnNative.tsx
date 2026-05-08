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

  const isVideo = project.thumbnail?.type === 'video';

  const aspectRatio =
    project.aspectRatio === '9:16'
      ? '9 / 16'
      : project.aspectRatio === '1:1'
      ? '1 / 1'
      : '16 / 9';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isLoaded ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        breakInside: 'avoid',
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={project.thumbnail?.src}
          poster={project.thumbnail?.poster}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: project.thumbnailPosition ?? '50% 50%',
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
          src={project.thumbnail?.src}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: project.thumbnailPosition ?? '50% 50%',
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
          background:
            'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
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
          transition: 'opacity 0.3s, transform 0.3s',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          {project.title}
        </p>
        {project.year && (
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.75rem',
              margin: '2px 0 0',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {project.year}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function GridThreeColumnNative({
  projects,
  onProjectClick,
  isLoaded,
}: GridThreeColumnNativeProps) {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else setColumns(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        columnCount: columns,
        columnGap: '0px',
        width: '100%',
        lineHeight: 0,
      }}
    >
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