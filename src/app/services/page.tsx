'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/Card';
import styles from '@/components/Card.module.css';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Business Automation & Internal Tooling',
    description:
      'Custom scripts and integrations to eliminate manual workflows, improve accuracy, and free up time. Specializing in Xero API, Zapier, EmailJS, and Google Apps Script integrations.',
    href: '/services/automation',
  },
  {
    title: 'Full-Stack Web App Development',
    description:
      'MVPs and internal dashboards with a modern frontend and scalable backend. Expertise in React, TypeScript, Node.js, and Deno for robust and maintainable applications.',
    href: '/services/web-development',
  },
  {
    title: 'Notion Systems & Productivity Consulting',
    description:
      'Custom CRMs, knowledge systems, and Zapier-integrated pipelines for operational clarity. Helping teams streamline their workflows and improve productivity.',
    href: '/services/notion',
  },
  {
    title: 'Education Tech & Tutoring Systems',
    description:
      'Curriculum tools, pseudocode engines, and student tracking solutions for tutors and edtech startups. Experience in GCSE and A-Level CS & Maths curriculum design.',
    href: '/services/edtech',
  },
  {
    title: 'Game Logic & Strategy Tools',
    description:
      'Tools for parsing complex game states, analyzing decks, and supporting turn-based game decision-making. Specializing in JSON-based game state analysis and heuristic evaluation.',
    href: '/services/game-tools',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Services() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 py-12">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          I offer specialized solutions to help businesses and individuals streamline their
          operations, build custom applications, and improve their productivity.
        </p>
      </motion.div>

      <motion.div 
        className={styles.cardGrid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {services.map(service => (
          <motion.div
            key={service.title}
            variants={item}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              title={service.title}
              description={service.description}
              href={service.href}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <a href="/contact">
          <Button variant="default" size="lg">
            Get in Touch
          </Button>
        </a>
      </motion.div>
    </div>
  );
}
