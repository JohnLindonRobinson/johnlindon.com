'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, type Variants } from "framer-motion";
import { projects, type Project } from '@/data/siteData';
import { useState } from 'react';
import ProjectModal from '@/components/modal/ProjectModal';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export default function FeaturedWork() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label and Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-left"
        >
          <h2 className="text-4xl font-bold mb-6">Featured Work</h2>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`group relative rounded-xl overflow-hidden border border-white/20 shadow-lg ${
                index % 2 === 0 
                  ? 'bg-gradient-to-b from-[#EDE5F4]/90 to-[#EDE5F4]/70' 
                  : 'bg-gradient-to-b from-[#F5EAFD]/90 to-[#F5EAFD]/70'
              }`}
              onClick={() => setActiveProject(project)}
              style={{ cursor: 'pointer' }}
            >
              {/* Unique Animated Background Blob */}
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.04, rotate: index % 2 === 0 ? 2 : -2 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                aria-hidden
              >
                <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <motion.path
                    d={
                      index % 4 === 0
                        ? 'M60,200 Q200,320 340,200 Q400,100 200,40 Q0,100 60,200Z'
                        : index % 4 === 1
                        ? 'M100,250 Q200,320 300,250 Q380,180 200,60 Q20,180 100,250Z'
                        : index % 4 === 2
                        ? 'M80,220 Q200,320 320,220 Q400,120 200,60 Q0,120 80,220Z'
                        : 'M120,260 Q200,320 280,260 Q360,200 200,80 Q40,200 120,260Z'
                    }
                    fill={index % 2 === 0 ? '#C8A9F0' : '#E0D1F5'}
                    opacity={0.13 + 0.04 * (index % 3)}
                    animate={{
                      scale: [1, 1.03, 1],
                      rotate: [0, 2 * (index % 2 === 0 ? 1 : -1), 0],
                    }}
                    transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              {/* Project Image */}
              <div className="relative h-64 bg-[#EFE6E6]/50 rounded-t-xl">
                <div className="absolute inset-0 flex items-center justify-center gap-4 transition-transform duration-700 ease-out group-hover:scale-105">
                  <Image
                    src="/images/project-icon-1.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="text-black transition-transform duration-500 ease-out group-hover:-translate-x-2"
                  />
                  <Image
                    src="/images/project-icon-2.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="text-black transition-transform duration-500 ease-out group-hover:translate-x-2"
                  />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <h3 className="font-manrope font-bold text-3xl md:text-4xl mb-2">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <div className="text-base md:text-lg text-purple-700/80 font-semibold mb-3">
                    {project.subtitle}
                  </div>
                )}

                <p className="font-work-sans font-light text-sm text-black/80 mb-6">
                  {project.description}
                </p>

                {/* Tags and Button Container */}
                <div className="flex items-center justify-between mt-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-primary/10 rounded-lg font-manrope font-light text-sm text-black/60 transition-all duration-300 ease-out hover:bg-primary/20 hover:text-purple-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="relative flex flex-col items-end justify-end">
                    {/* Corner Flourish */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-xl transition-colors duration-300 group-hover:border-primary/40" />
                    <Button 
                      asChild
                      variant="default" 
                      className="font-manrope font-bold hover:bg-transparent hover:text-primary transition-colors px-4 group/cta"
                    >
                      <Link href={`/portfolio/${index + 1}`}
                        className="flex flex-col items-end text-right"
                      >
                        <span>Learn More <span aria-hidden>→</span></span>
                        <span className="block text-xs text-purple-700/80 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 ease-out mt-1">View Case Study</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for project detail */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  )
} 