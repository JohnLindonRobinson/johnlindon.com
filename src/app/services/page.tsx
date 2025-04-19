import Button from '@/components/Button';
import Card from '@/components/Card';

const services = [
  {
    title: 'Business Automation & Internal Tooling',
    description:
      'Custom scripts and integrations to eliminate manual workflows, improve accuracy, and free up time. Specializing in Xero API, Zapier, EmailJS, and Google Apps Script integrations.',
    tags: ['Automation', 'Integration', 'Xero', 'Zapier', 'Google Apps Script'],
    href: '/services/automation',
  },
  {
    title: 'Full-Stack Web App Development',
    description:
      'MVPs and internal dashboards with a modern frontend and scalable backend. Expertise in React, TypeScript, Node.js, and Deno for robust and maintainable applications.',
    tags: ['React', 'TypeScript', 'Node.js', 'Deno', 'PostgreSQL'],
    href: '/services/web-development',
  },
  {
    title: 'Notion Systems & Productivity Consulting',
    description:
      'Custom CRMs, knowledge systems, and Zapier-integrated pipelines for operational clarity. Helping teams streamline their workflows and improve productivity.',
    tags: ['Notion', 'Airtable', 'Zapier', 'Productivity', 'CRM'],
    href: '/services/notion',
  },
  {
    title: 'Education Tech & Tutoring Systems',
    description:
      'Curriculum tools, pseudocode engines, and student tracking solutions for tutors and edtech startups. Experience in GCSE and A-Level CS & Maths curriculum design.',
    tags: ['EdTech', 'Curriculum', 'Tutoring', 'Assessment', 'Learning Tools'],
    href: '/services/edtech',
  },
  {
    title: 'Game Logic & Strategy Tools',
    description:
      'Tools for parsing complex game states, analyzing decks, and supporting turn-based game decision-making. Specializing in JSON-based game state analysis and heuristic evaluation.',
    tags: ['Game Development', 'Logic', 'Strategy', 'Analysis', 'JSON'],
    href: '/services/game-tools',
  },
];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          I offer specialized solutions to help businesses and individuals streamline their
          operations, build custom applications, and improve their productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <Card
            key={service.title}
            title={service.title}
            description={service.description}
            tags={service.tags}
            href={service.href}
          >
            <Button href={service.href} variant="outline" size="sm" className="mt-4">
              Learn More
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button href="/contact" variant="primary" size="lg">
          Get in Touch
        </Button>
      </div>
    </div>
  );
}
