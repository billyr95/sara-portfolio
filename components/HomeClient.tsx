'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from '@/components/ProjectModal';
import PortfolioGrid from '@/components/PortfolioGrid';
import { Project } from '@/types';
import UnicornScene from 'unicornstudio-react/next';

export default function HomeClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center justify-center px-6">
          <div className="w-96 h-32 flex items-center justify-center">
            <UnicornScene
              projectId="KBn7vDUSJdNibc47UYOd"
              sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.3/dist/unicornStudio.umd.js"
              width="100%"
              height="100%"
            />
          </div>
        </div>
        <nav className="absolute top-8 right-6 hidden md:flex items-center gap-8 text-sm tracking-wide text-neutral-600">
          <a href="#work" className="hover:text-neutral-900 transition-colors">Work</a>
          <a href="#about" className="hover:text-neutral-900 transition-colors">About</a>
          <a href="#contact" className="hover:text-neutral-900 transition-colors">Contact</a>
        </nav>
        <button className="absolute top-8 right-6 md:hidden text-neutral-600">
          <span className="sr-only">Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </motion.header>

      {/* Grid */}
      <section id="work" className="pt-32 px-4 sm:px-8 md:px-12 lg:px-[50px]">
        {projects.length > 0 ? (
          <PortfolioGrid
            projects={projects}
            onProjectClick={setSelectedProject}
            isLoaded={isLoaded}
          />
        ) : (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg">No projects yet.</p>
            <p className="text-sm mt-2">Add projects in <a href="/studio" className="underline">Sanity Studio</a></p>
          </div>
        )}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}