'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './about.module.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// Quick facts data
const quickFacts = [
  { icon: '📍', label: 'Based in the UK' },
  { icon: '🎓', label: 'Studied CS & Maths at Manchester' },
  { icon: '🎭', label: 'Into LARP, barbershop, Commander decks' },
  { icon: '🧩', label: 'Systems-focused developer' },
];

// Skills data
const skills = [
  'React', 'TypeScript', 'Tailwind', 'Notion', 'Deno', 'Xero',
  'Next.js', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#fcfbfd] pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-sm font-semibold tracking-wider text-primary/80">
            03 — ABOUT ME
          </span>
        </motion.div>

        {/* Main Grid Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 ${styles.aboutContainer}`}>
          {/* Left Column - About Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-6 mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-primary/5">
                <Image
                  src="/images/profile.jpg"
                  alt="John Lindon"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                Hi, I'm John
                <motion.span
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 15,
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                  className="inline-block cursor-default"
                >
                  ✨
                </motion.span>
                
              </h1>
            </div>

            <div className="prose prose-lg max-w-prose">
              <p>
                With a background in Computer Science and Mathematics from Manchester University,
                I've developed a deep appreciation for elegant solutions to complex problems.
                As a freelance developer, I specialize in building robust web applications and
                automation systems that make work flow smoother.
              </p>
              
              <p>
                My expertise lies in React ecosystem development, business process automation,
                and creating comprehensive Notion systems. I'm passionate about writing clean,
                well-documented code that's both maintainable and expressive.
              </p>

              <p>
                What truly excites me is the intersection of systems thinking and practical
                solutions. Whether it's optimizing workflows, crafting intuitive interfaces,
                or helping teams work more efficiently, I'm always eager to tackle new challenges.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Quick Facts & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-12"
          >
            {/* Quick Facts */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Quick Facts</h2>
              <div className="grid gap-4">
                {quickFacts.map((fact, index) => (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    className={`flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm border border-primary/5 ${styles.quickFact}`}
                  >
                    <span className="text-2xl">{fact.icon}</span>
                    <span className="text-lg">{fact.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Skills & Tools</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + (index * 0.05) }}
                    className={`px-4 py-2 rounded-full bg-primary/5 text-primary font-medium text-sm ${styles.skillTag}`}
                  >
                    #{skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <h3 className="text-2xl font-semibold mb-6">
            Want to work together?
          </h3>
          <Button asChild size="lg">
            <Link href="/contact">
              Let's Talk
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
