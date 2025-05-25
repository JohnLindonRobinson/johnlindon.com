'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import styles from './portfolio.module.css';
import Image from 'next/image';
import { useParallax } from '@/hooks/useParallax';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectModal from '@/components/modal/ProjectModal';
import { loadProject, LoadedProject } from '@/lib/loadProject';
import { projects } from '@/data/siteData';

// Define categories for filtering
const categories = ['All', 'Web Apps', 'AI & Automation', 'Dev Tools'];

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PortfolioPage({ searchParams }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxOffset = useParallax(0.4);
  const router = useRouter();
  
  const logoY = useTransform(scrollY, [0, 1000], [0, 200]);
  const logoScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 10]);

  const [activeProject, setActiveProject] = useState<LoadedProject | null>(null);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category.toLowerCase());
      router.push(`/portfolio?${params.toString()}`);
    } else {
      router.push("/portfolio");
    }
  };

  // Get the current category from URL params, defaulting to 'all'
  const currentCategory = typeof searchParams.category === 'string' 
    ? searchParams.category.toLowerCase() 
    : 'all';

  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (currentCategory === 'all') return true;
      // Normalize category names for comparison
      const normalize = (str: string) => str.toLowerCase().replace(/\s|&/g, '');
      return normalize(project.category) === normalize(currentCategory);
    });
  }, [currentCategory]);

  const updateIndicator = (index: number) => {
    if (!filterWrapperRef.current) return;
    
    const buttons = filterWrapperRef.current.getElementsByTagName('button');
    if (buttons[index]) {
      const button = buttons[index];
      const wrapperRect = filterWrapperRef.current.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - wrapperRect.left
      });
    }
  };

  useEffect(() => {
    // Always select 'All' on mount if nothing is selected
    if (!categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())) {
      setSelectedCategory('All');
      updateIndicator(0);
      return;
    }
    // Update indicator for the selected category
    const categoryIndex = categories.findIndex(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    updateIndicator(categoryIndex);
  }, [selectedCategory]);

  useEffect(() => {
    const projectSlug = typeof searchParams.project === 'string' ? searchParams.project : null;
    if (projectSlug) {
      loadProject(projectSlug).then(setActiveProject);
    } else {
      setActiveProject(null);
    }
  }, [searchParams]);

  const openModal = async (slug: string) => {
    const project = await loadProject(slug);
    setActiveProject(project);
    const params = new URLSearchParams();
    // Preserve existing category if present
    if (typeof searchParams.category === 'string') {
      params.set('category', searchParams.category);
    }
    params.set('project', slug);
    router.push(`/portfolio?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    setActiveProject(null);
    router.push('/portfolio', { scroll: false });
  };

  return (
    <motion.div 
      className={styles.portfolioContainer + ' relative'}
      style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated SVG background layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute top-[-10%] left-[10%] w-[40vw] animate-slowspin opacity-5">
          <circle cx="50%" cy="50%" r="120" fill="#A78BFA" />
        </svg>
        <svg className="absolute bottom-[-15%] right-[5%] w-[30vw] animate-slowspin opacity-10" style={{ animationDuration: '90s' }}>
          <ellipse cx="60%" cy="60%" rx="100" ry="80" fill="#F472B6" />
        </svg>
        <svg className="absolute top-[30%] left-[60%] w-[25vw] animate-slowspin opacity-10" style={{ animationDuration: '75s' }}>
          <circle cx="50%" cy="50%" r="80" fill="#34D399" />
        </svg>
      </div>
      <Image
        src="/logo.svg"
        alt="Background Logo"
        width={1200}
        height={1200}
        className={styles.backgroundLogo}
        style={{
          transform: `translate3d(${parallaxOffset * 0.5}px, ${parallaxOffset * 0.2}px, 0) rotate(-15deg) scale(1.5)`,
        }}
      />
      
      <div className="max-w-6xl mx-auto px-6 py-16 pt-24 relative z-10">
        {/* Section Label and Headline */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold mb-6">My Portfolio</h1>
          <p className="text-lg text-muted-foreground mb-8">Explore my latest projects and achievements</p>
        </div>

        <div className={styles.filterBar + ' mb-8'}>
          <div ref={filterWrapperRef} className={styles.filterWrapper}>
            <motion.div
              data-testid="category-indicator"
              className={styles.indicator}
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left
              }}
            />
            {categories.map(category => (
              <button
                key={category}
                data-category={category}
                data-active={selectedCategory.toLowerCase() === category.toLowerCase()}
                onClick={() => handleCategoryClick(category)}
                className={
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? `${styles.tag} ${styles.active}`
                    : styles.tag
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          className={styles.projectGrid}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group bg-white/70 backdrop-blur p-6 rounded-xl shadow-xl transition-transform hover:shadow-2xl relative overflow-hidden cursor-pointer"
                onClick={() => openModal(project.slug)}
              >
                <div className="absolute right-4 bottom-4 text-7xl opacity-10 group-hover:opacity-20 group-hover:scale-[1.15] transition-all duration-300">
                  {project.backgroundIcon}
                </div>
                <h3 className="text-xl font-bold mb-2 z-10 relative">{project.title}</h3>
                <p className="text-sm text-gray-700 z-10 relative">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.tags.map(tag => (
                    <span className="badge" key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal for project detail */}
      <ProjectModal project={activeProject} onClose={closeModal} />
    </motion.div>
  );
}
