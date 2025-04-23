'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import styles from './portfolio.module.css';
import Image from 'next/image';
import { useParallax } from '@/hooks/useParallax';
import { Button } from '@/components/ui/button';

// Define the project data structure
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
  category: string;
}

// Sample project data
const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Task Management',
    description: 'A smart task management system that uses AI to prioritize and organize tasks efficiently.',
    image: '/projects/task-management.jpg',
    tags: ['React', 'TypeScript', 'AI', 'Node.js'],
    href: '/projects/task-management',
    category: 'web'
  },
  {
    id: '2',
    title: 'Educational Platform',
    description: 'An interactive learning platform with real-time collaboration features for students and teachers.',
    image: '/projects/education.jpg',
    tags: ['Next.js', 'MongoDB', 'WebRTC', 'Tailwind'],
    href: '/projects/education-platform',
    category: 'education'
  },
  {
    id: '3',
    title: 'Business Analytics Dashboard',
    description: 'A comprehensive analytics dashboard for business intelligence and data visualization.',
    image: '/projects/analytics.jpg',
    tags: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
    href: '/projects/analytics-dashboard',
    category: 'business'
  },
  // Add more projects as needed
];

// Define categories for filtering
const categories = ['all', 'web', 'education', 'business'];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxOffset = useParallax(0.4);
  
  const logoY = useTransform(scrollY, [0, 1000], [0, 200]);
  const logoScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 10]);

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
    // Initialize the indicator position for the 'all' category
    const categoryIndex = categories.indexOf(selectedCategory.toLowerCase());
    updateIndicator(categoryIndex);
  }, [selectedCategory]);

  const filteredProjects = projects.filter(project => 
    selectedCategory.toLowerCase() === 'all' ? true : project.category === selectedCategory.toLowerCase()
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateIndicator(categories.indexOf(category));
  };

  return (
    <motion.div 
      className={styles.portfolioContainer}
      style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
      
      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-4">My Portfolio</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Explore my latest projects and achievements
        </p>

        <div className={styles.filterBar}>
          <div className={styles.filterWrapper} ref={filterWrapperRef}>
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => handleCategoryChange(category)}
                className={`relative z-[2] capitalize px-4 ${
                  selectedCategory.toLowerCase() === category ? 'text-white' : ''
                }`}
              >
                {category}
              </Button>
            ))}
            <motion.div
              className={styles.indicator}
              style={{
                width: indicatorStyle.width,
                left: indicatorStyle.left,
              }}
            />
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
