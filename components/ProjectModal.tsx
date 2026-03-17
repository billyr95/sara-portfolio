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

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tags = project.tags ?? [];
  const media = project.media ?? [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % media.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, media.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close button */}
      <motion.button
        className="fixed top-5 right-5 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 backdrop-blur-sm hover:bg-neutral-200 transition-colors"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <motion.button
            className="fixed left-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 backdrop-blur-sm hover:bg-neutral-200 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveIndex((prev) => (prev - 1 + media.length) % media.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </motion.button>
          <motion.button
            className="fixed right-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 backdrop-blur-sm hover:bg-neutral-200 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveIndex((prev) => (prev + 1) % media.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </motion.button>
        </>
      )}

      {/* Main content */}
      <div ref={contentRef} className="h-full overflow-y-auto overscroll-contain">
        {/* Hero media */}
        <motion.div 
          className="min-h-screen flex items-center justify-center p-8 md:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative max-w-6xl w-full aspect-video flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="w-full h-full flex items-center justify-center"
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

        {/* Media indicators */}
        {media.length > 1 && (
          <motion.div 
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {media.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </motion.div>
        )}

        {/* Project info */}
        <motion.div 
          className="bg-neutral-50 border-t border-neutral-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <div className="mb-12">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs uppercase tracking-[0.2em] text-neutral-500 border border-white/20 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 ml-auto">
                  {project.year}
                </span>
              </motion.div>
              
              <motion.h1 
                className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {project.title}
              </motion.h1>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 gap-12 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">About</h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Details</h3>
                <dl className="space-y-3 text-neutral-500">
                  <div className="flex justify-between">
                    <dt>Format</dt>
                    <dd className="text-neutral-900">{project.aspectRatio}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Media</dt>
                    <dd className="text-neutral-900">{media.length} items</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Category</dt>
                    <dd className="text-neutral-900">{tags[0] ?? '—'}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>

            {/* Gallery thumbnails */}
            {media.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {media.map((item, index) => (
                    <button
                      key={index}
                      className={`relative aspect-square overflow-hidden transition-all duration-300 ${
                        index === activeIndex 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-50' 
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      onClick={() => {
                        setActiveIndex(index);
                        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.src}
                          poster={item.poster}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                              <polygon points="2,0 12,6 2,12" />
                            </svg>
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