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
  isMobile,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  isLoaded: boolean;
  isMobile: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const isVideo = project.thumbnail?.type === 'video';

  // 9:16 portrait: always natural ratio (contain)
  // 16:9 on mobile: natural 16:9 ratio
  // everything else: fixed 300px crop
  const is916 = project.aspectRatio === '9:16';
  const is169mobile = isMobile && (!project.aspectRatio || project.aspectRatio === '16:9');
  const is916mobile = isMobile && is916;

  const focalPoint = project.thumbnailPosition ?? '50% 50%';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: (is169mobile || is916mobile) ? 'auto' : '300px',
        overflow: (is169mobile || is916mobile) ? 'visible' : 'hidden',
        position: 'relative',
        backgroundColor: '#ffffff',
      }}
    >
      {is169mobile ? (
        // 16:9 on mobile — natural aspect ratio, full width
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={project.thumbnail?.src}
              poster={project.thumbnail?.poster}
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
              src={project.thumbnail?.src}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: focalPoint,
                display: 'block',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              loading="lazy"
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
              pointerEvents: 'none',
            }}
          />
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
            <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>
              {project.title}
            </p>
            {project.year && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '2px 0 0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {project.year}
              </p>
            )}
          </div>
        </div>
      ) : is916 ? (
        // 9:16 — natural full-width on mobile, contained in 300px on desktop
        <div
          style={{
            width: '100%',
            ...(is916mobile
              ? { aspectRatio: '9 / 16' }
              : { height: '100%' }),
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={project.thumbnail?.src}
              poster={project.thumbnail?.poster}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
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
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
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
        </div>
      ) : (
        // Non-16:9 — fixed height crop with background-position focal point (original behavior)
        <div
          style={{
            width: '100%',
            height: '300px',
            position: 'relative',
            backgroundImage: `url(${project.thumbnail?.src})`,
            backgroundSize: 'cover',
            backgroundPosition: focalPoint,
            flexShrink: 0,
          }}
        >
          {isVideo && (
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
                display: 'block',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              muted
              loop
              playsInline
              preload="metadata"
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
        </div>
      )}
    </motion.div>
  );
}

export default function GridThreeColumnNative({
  projects,
  onProjectClick,
  isLoaded,
}: GridThreeColumnNativeProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '16px',
        width: '100%',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      {projects.map((project, index) => (
        <GridItem
          key={project._id}
          project={project}
          index={index}
          onClick={() => onProjectClick(project)}
          isLoaded={isLoaded}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}