'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Project, AspectRatio } from '@/types';

interface PortfolioGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  isLoaded: boolean;
}

interface LayoutItem {
  project: Project;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  key: string;
}

function getAspectRatioValue(aspectRatio: AspectRatio): number {
  switch (aspectRatio) {
    case '16:9': return 16 / 9;
    case '9:16': return 9 / 16;
    case '1:1': return 1;
    default: return 1;
  }
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function calculateInfiniteLayout(
  projects: Project[],
  containerWidth: number,
  viewportHeight: number,
  scrollY: number,
  baseUnit: number = 200
): { items: LayoutItem[]; totalHeight: number } {
  if (containerWidth === 0 || projects.length === 0) {
    return { items: [], totalHeight: 0 };
  }

  const items: LayoutItem[] = [];
  const numColumns = Math.max(1, Math.floor(containerWidth / baseUnit));
  const cellWidth = containerWidth / numColumns;
  const cellHeight = cellWidth; // Square cells for easier math
  
  const targetHeight = scrollY + viewportHeight * 3;
  const targetRows = Math.ceil(targetHeight / cellHeight) + 5;
  
  // Create grid filled with false
  const grid: boolean[][] = [];
  for (let r = 0; r < targetRows; r++) {
    grid.push(new Array(numColumns).fill(false));
  }
  
  const canPlace = (col: number, row: number, colSpan: number, rowSpan: number): boolean => {
    if (col + colSpan > numColumns || row + rowSpan > grid.length) return false;
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (grid[r][c]) return false;
      }
    }
    return true;
  };
  
  const occupy = (col: number, row: number, colSpan: number, rowSpan: number) => {
    for (let r = row; r < row + rowSpan; r++) {
      for (let c = col; c < col + colSpan; c++) {
        if (r < grid.length && c < numColumns) {
          grid[r][c] = true;
        }
      }
    }
  };

  // Find first empty cell
  const findFirstEmpty = (): { col: number; row: number } | null => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < numColumns; col++) {
        if (!grid[row][col]) {
          return { col, row };
        }
      }
    }
    return null;
  };

  // Get max colSpan that fits at position
  const getMaxColSpan = (col: number, row: number, maxSpan: number): number => {
    let span = 0;
    for (let c = col; c < Math.min(col + maxSpan, numColumns); c++) {
      if (grid[row][c]) break;
      span++;
    }
    return span;
  };

  // Get max rowSpan that fits at position with given colSpan
  const getMaxRowSpan = (col: number, row: number, colSpan: number, maxSpan: number): number => {
    let span = 0;
    for (let r = row; r < Math.min(row + maxSpan, grid.length); r++) {
      let rowClear = true;
      for (let c = col; c < col + colSpan; c++) {
        if (grid[r][c]) {
          rowClear = false;
          break;
        }
      }
      if (!rowClear) break;
      span++;
    }
    return span;
  };

  let placedCount = 0;
  let iterations = 0;
  const maxIterations = 1000;

  while (iterations < maxIterations) {
    const empty = findFirstEmpty();
    if (!empty) break;
    
    const { col, row } = empty;
    
    // Pick a project randomly
    const seed = placedCount * 127 + row * 31 + col;
    const projectIndex = Math.floor(seededRandom(seed) * projects.length);
    const project = projects[projectIndex];
    const aspectRatio = getAspectRatioValue(project.aspectRatio);
    
    // Determine ideal size based on aspect ratio
    let idealColSpan: number;
    let idealRowSpan: number;
    
    const sizeVariant = seededRandom(seed * 17);
    
    if (aspectRatio > 1.2) {
      // Landscape - wide
      idealColSpan = sizeVariant > 0.6 ? 3 : 2;
      idealRowSpan = 1;
    } else if (aspectRatio < 0.8) {
      // Portrait - tall
      idealColSpan = 1;
      idealRowSpan = 2;
    } else {
      // Square
      const size = sizeVariant > 0.7 ? 2 : 1;
      idealColSpan = size;
      idealRowSpan = size;
    }
    
    // Constrain to available space
    const maxCol = getMaxColSpan(col, row, idealColSpan);
    const colSpan = Math.max(1, Math.min(idealColSpan, maxCol));
    const maxRow = getMaxRowSpan(col, row, colSpan, idealRowSpan);
    const rowSpan = Math.max(1, Math.min(idealRowSpan, maxRow));
    
    // Place it
    occupy(col, row, colSpan, rowSpan);
    
    items.push({
      project,
      x: col * cellWidth,
      y: row * cellHeight,
      width: colSpan * cellWidth,
      height: rowSpan * cellHeight,
      index: placedCount,
      key: `${project._id}-${placedCount}`,
    });
    
    placedCount++;
    iterations++;
  }

  return { items, totalHeight: grid.length * cellHeight };
}

function GridItem({ 
  item,
  onClick,
  isLoaded 
}: { 
  item: LayoutItem;
  onClick: () => void;
  isLoaded: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { project, x, y, width, height, index } = item;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <motion.article
      className="absolute cursor-pointer overflow-hidden"
      style={{ left: x, top: y, width, height }}
      initial={{ opacity: 0 }}
      animate={isLoaded ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.3) }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-neutral-200">
        {project.thumbnail.type === 'video' ? (
          <video
            ref={videoRef}
            src={project.thumbnail.src}
            poster={project.thumbnail.poster}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={project.thumbnail.src}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            loading="lazy"
          />
        )}
      </div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div 
        className="absolute inset-0 p-4 flex flex-col justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          {(project.tags ?? []).slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] uppercase tracking-widest text-white/90 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg md:text-xl leading-tight text-white">{project.title}</h3>
        <p className="text-xs text-white/70 mt-1">{project.year}</p>
      </motion.div>
    </motion.article>
  );
}

export default function PortfolioGrid({ projects, onProjectClick, isLoaded }: PortfolioGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      setViewportHeight(window.innerHeight);
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    updateDimensions();
    handleScroll();
    
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { items, totalHeight } = useMemo(() => {
    const baseUnit = containerWidth < 640 ? 150 : containerWidth < 1024 ? 180 : 220;
    return calculateInfiniteLayout(projects, containerWidth, viewportHeight, scrollY, baseUnit);
  }, [projects, containerWidth, viewportHeight, scrollY]);

  const visibleItems = useMemo(() => {
    const buffer = viewportHeight;
    return items.filter(item => 
      item.y + item.height > scrollY - buffer && 
      item.y < scrollY + viewportHeight + buffer
    );
  }, [items, scrollY, viewportHeight]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative w-full" style={{ height: totalHeight }}>
        {visibleItems.map((item) => (
          <GridItem
            key={item.key}
            item={item}
            onClick={() => onProjectClick(item.project)}
            isLoaded={isLoaded}
          />
        ))}
      </div>
    </div>
  );
}