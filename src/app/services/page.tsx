'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import PeekingScrollSnap, { Service } from '@/components/PeekingScrollSnap';
import styles from './services.module.css';
import { motion } from 'framer-motion';

const services: Service[] = [
  {
    id: 1,
    slug: 'business-automation',
    title: 'Business Automation',
    description: 'Streamline your business processes with custom automation solutions',
    imageUrl: '/icons/automation.svg',
    href: '/services/business-automation',
    tags: ['Automation', 'Business', 'Efficiency', 'Integration'],
    details: 'Automate repetitive tasks, integrate APIs, and optimize workflows for efficiency.',
    deliverables: [
      'Custom workflow automation',
      'API integration strategy',
      'Post-launch support'
    ],
    idealClient: 'Best for teams drowning in busywork.',
    cta: 'Request This Service',
  },
  {
    id: 2,
    slug: 'web-development',
    title: 'Full-Stack Web Development',
    description: 'Modern, scalable web applications built with cutting-edge technology',
    imageUrl: '/icons/webdev.svg',
    href: '/services/web-development',
    tags: ['Web Dev', 'Full Stack', 'React', 'Node.js'],
    details: 'Build robust, scalable web apps with modern frameworks and best practices.',
    deliverables: [
      'Responsive frontend & backend',
      'Database design & integration',
      'Deployment & CI/CD setup'
    ],
    idealClient: 'Great for startups and businesses ready to scale.',
    cta: 'Request This Service',
  },
  {
    id: 3,
    slug: 'notion-consulting',
    title: 'Notion Systems Consulting',
    description: 'Transform your Notion workspace into a powerful business tool',
    imageUrl: '/icons/notion.svg',
    href: '/services/notion-consulting',
    tags: ['Notion', 'Productivity', 'Organization', 'Workflow'],
    details: 'Design and implement custom Notion systems for project management, CRM, and more.',
    deliverables: [
      'Workspace audit & redesign',
      'Custom templates & automations',
      'Team onboarding & training'
    ],
    idealClient: 'Perfect for teams wanting to get more from Notion.',
    cta: 'Request This Service',
  },
  {
    id: 4,
    slug: 'education-tech',
    title: 'Education Tech Solutions',
    description: 'Custom software solutions for educational institutions',
    imageUrl: '/icons/education.svg',
    href: '/services/education-tech',
    tags: ['EdTech', 'Education', 'Learning', 'Software'],
    details: 'Develop tools and platforms to enhance learning and administration.',
    deliverables: [
      'E-learning platform development',
      'Student management systems',
      'Analytics & reporting tools'
    ],
    idealClient: 'Ideal for schools, colleges, and edtech startups.',
    cta: 'Request This Service',
  }
];

export default function Services() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Open drawer if query param matches a service slug
  useEffect(() => {
    const slug = searchParams?.get ? searchParams.get('open') : null;
    if (slug && services.some(s => s.slug === slug)) {
      setOpenSlug(slug);
      // Scroll to card
      const idx = services.findIndex(s => s.slug === slug);
      setTimeout(() => {
        cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setOpenSlug(null);
    }
  }, [searchParams]);

  // Handle card click
  const handleCardClick = (slug: string, idx: number) => {
    if (openSlug === slug) {
      setOpenSlug(null);
      router.push('/services', { scroll: false });
    } else {
      setOpenSlug(slug);
      const params = new URLSearchParams((searchParams || '').toString());
      params.set('open', slug);
      router.push(`/services?${params.toString()}`, { scroll: false });
      setTimeout(() => {
        cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-16 pt-24">
      {/* Overlay when a drawer is open */}
      {openSlug && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-700 ease-in-out"
          aria-hidden="true"
          onClick={() => {
            setOpenSlug(null);
            router.push('/services', { scroll: false });
          }}
        />
      )}
      {/* Section Heading & Intro */}
      <div className="mb-8 relative z-40 text-left">
        <h1 className="text-4xl font-bold mb-4">Ways I Can Help</h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          From business automation to educational tools, each solution is tailored to help you move faster, build smarter, or simplify your workflow.
        </p>
      </div>
      {/* Staggered Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-6xl mx-auto mt-12">
        {services.map((service, idx) => (
          <div key={service.id} className="relative">
            <motion.div
              ref={el => { cardRefs.current[idx] = el; }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-xl bg-purple-50 group shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer
                ${openSlug && openSlug !== service.slug ? 'opacity-40 pointer-events-none grayscale' : ''}
                ${openSlug === service.slug ? 'z-50' : ''}
              `}
              onClick={() => handleCardClick(service.slug!, idx)}
              aria-expanded={openSlug === service.slug}
              style={{ zIndex: openSlug === service.slug ? 50 : 1 }}
            >
              {/* Emoji background layer */}
              <div className="absolute right-4 bottom-4 text-7xl md:text-7xl text-5xl opacity-10 group-hover:opacity-20 group-hover:scale-[1.15] transition-all duration-300 select-none pointer-events-none">
                {idx === 0 && '💡'}
                {idx === 1 && '🧱'}
                {idx === 2 && '🗃'}
                {idx === 3 && '🎓'}
              </div>
              {/* Card content */}
              <h2 className="text-xl font-semibold mb-2 relative z-10">{service.title}</h2>
              <p className="text-sm text-gray-700 mb-3 relative z-10">{service.description}</p>
              <span className="text-sm text-purple-600 font-medium hover:underline relative z-10 block w-fit">Learn More &rarr;</span>
            </motion.div>
            {/* Drawer Reveal */}
            <motion.div
              initial={false}
              animate={openSlug === service.slug ? { height: 'auto', opacity: 1, marginTop: 16 } : { height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', zIndex: openSlug === service.slug ? 50 : 1, position: openSlug === service.slug ? 'relative' : 'static' }}
              aria-expanded={openSlug === service.slug}
            >
              {openSlug === service.slug && (
                <div className="mt-4 bg-white rounded-xl shadow-inner p-6 border border-gray-200 relative">
                  {/* Close (X) icon */}
                  <button
                    aria-label="Close details"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-xl font-bold focus:outline-none z-10"
                    onClick={() => {
                      setOpenSlug(null);
                      router.push('/services', { scroll: false });
                    }}
                    tabIndex={0}
                    type="button"
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold mb-2">What's included</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mb-4">
                    {service.deliverables?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mb-2 italic">{service.idealClient}</p>
                  <a href="/contact" className="text-sm text-purple-600 font-medium hover:underline">{service.cta} &rarr;</a>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
