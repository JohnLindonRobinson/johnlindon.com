'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Card from '@/components/Card';
import styles from './services.module.css';

const services = [
  {
    id: 1,
    title: 'Business Automation',
    description: 'Streamline your business processes with custom automation solutions',
    briefExplanation: 'Streamline your business processes with custom automation solutions',
    whatIsIt: 'A comprehensive service that identifies, designs, and implements automation solutions for your business processes, reducing manual work and increasing efficiency.',
    whatDoIDeliver: [
      'Process analysis and optimization',
      'Custom automation software',
      'Integration with existing systems',
      'Training and documentation'
    ],
    whoIsItFor: 'Business owners and managers looking to improve efficiency and reduce operational costs through automation.',
    tags: ['Automation', 'Business', 'Efficiency', 'Integration'],
    href: '/services/business-automation',
    imageUrl: '/icons/automation.svg'
  },
  {
    id: 2,
    title: 'Full-Stack Web Development',
    description: 'Modern, scalable web applications built with cutting-edge technology',
    briefExplanation: 'Modern, scalable web applications built with cutting-edge technology',
    whatIsIt: 'End-to-end web application development service covering everything from user interface design to backend infrastructure and deployment.',
    whatDoIDeliver: [
      'Custom web applications',
      'Responsive design',
      'API development',
      'Database design',
      'Cloud deployment'
    ],
    whoIsItFor: 'Businesses and organizations needing custom web applications that scale with their needs.',
    tags: ['Web Dev', 'Full Stack', 'React', 'Node.js'],
    href: '/services/web-development',
    imageUrl: '/icons/webdev.svg'
  },
  {
    id: 3,
    title: 'Notion Systems Consulting',
    description: 'Transform your Notion workspace into a powerful business tool',
    briefExplanation: 'Transform your Notion workspace into a powerful business tool',
    whatIsIt: 'Expert consulting to help you leverage Notion for business operations, project management, and team collaboration.',
    whatDoIDeliver: [
      'Workspace optimization',
      'Custom templates',
      'Workflow automation',
      'Team training'
    ],
    whoIsItFor: 'Teams and businesses looking to maximize their Notion workspace efficiency.',
    tags: ['Notion', 'Productivity', 'Organization', 'Workflow'],
    href: '/services/notion-consulting',
    imageUrl: '/icons/notion.svg'
  },
  {
    id: 4,
    title: 'Education Tech Solutions',
    description: 'Custom software solutions for educational institutions',
    briefExplanation: 'Custom software solutions for educational institutions',
    whatIsIt: 'Specialized software development for educational institutions, focusing on learning management, student engagement, and administrative efficiency.',
    whatDoIDeliver: [
      'Learning platforms',
      'Student management systems',
      'Assessment tools',
      'Analytics dashboards'
    ],
    whoIsItFor: 'Educational institutions seeking to enhance their digital infrastructure and learning experience.',
    tags: ['EdTech', 'Education', 'Learning', 'Software'],
    href: '/services/education-tech',
    imageUrl: '/icons/education.svg'
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const calculateActiveService = (progress: number) => {
    const serviceIndex = Math.floor(progress * services.length);
    return Math.min(serviceIndex, services.length - 1);
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setActiveService(calculateActiveService(latest));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className={styles.servicesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>SERVICES & SOLUTIONS</h1>
        <p className={styles.subtitle}>
          Transforming ideas into powerful digital solutions. Explore my services below to find the perfect match for your needs.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.serviceNav}>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={`${styles.serviceNavItem} ${index === activeService ? styles.active : ''}`}
                initial={false}
                animate={{
                  scale: index === activeService ? 1.1 : 1,
                  opacity: index === activeService ? 1 : 0.6
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  const element = document.getElementById(`service-${service.id}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {service.title}
              </motion.div>
            ))}
          </div>
        </div>

        <div ref={containerRef} className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className={styles.serviceCard}
            >
              <Card
                {...service}
                isActive={index === activeService}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
