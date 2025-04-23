import { Button } from '@/components/ui/button';
import { Card } from '@/components/Card';

const projects = [
  {
    title: 'TCQuick – E-Commerce Fulfillment Platform',
    description:
      'A comprehensive platform for order fulfillment, VAT compliance, and internal tooling. Reduced fulfillment time by 65% and enabled 3x business growth without additional hires.',
    tags: ['Automation', 'Xero API', 'E-commerce', 'VAT Compliance', 'Inventory Management'],
    href: '/portfolio/tcquick',
    imageUrl: '/images/tcquick.jpg', // Changed from image to imageUrl
  },
  {
    title: 'BullSheet – Stock Trading Simulator',
    description:
      'A sophisticated stock trading simulator with paper trading, financial news aggregation, and market data charts. Built with Deno, React, TypeScript, and PostgreSQL.',
    tags: ['Deno', 'React', 'TypeScript', 'PostgreSQL', 'Financial Tech'],
    href: '/portfolio/bullsheet',
    imageUrl: '/images/bullsheet.jpg', // Changed from image to imageUrl
  },
  {
    title: 'MTG Analyzer',
    description:
      'An advanced tool for parsing JSON-based game states and suggesting optimal plays. Features deck analysis and heuristic evaluation for strategic decision-making.',
    tags: ['Game Development', 'JSON', 'Logic', 'Strategy', 'Analysis'],
    href: '/portfolio/mtg-analyzer',
    imageUrl: '/images/mtg-analyzer.jpg', // Changed from image to imageUrl
  },
  {
    title: 'Tutor Admin Suite',
    description:
      'A comprehensive Notion and Google Workspace integration for managing tutoring businesses. Tracks lessons, student progress, invoices, and feedback.',
    tags: ['Notion', 'Google Workspace', 'Education', 'CRM', 'Automation'],
    href: '/portfolio/tutor-admin',
    imageUrl: '/images/tutor-admin.jpg', // Changed from image to imageUrl
  },
];

export default function Portfolio() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore my recent projects and see how I've helped clients solve complex problems with
          custom solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/cards relative border-4 border-dashed border-transparent hover:border-yellow-500 p-4">
        <div className="pointer-events-none fixed inset-0 bg-purple-900 opacity-0 group-hover/cards:opacity-50 transition-opacity duration-300" />
        <div className="pointer-events-none absolute inset-0 bg-yellow-500/20 opacity-0 group-hover/cards:opacity-100 transition-opacity duration-300" />
        {projects.map(project => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
            tags={project.tags}
            href={project.href}
            imageUrl={project.imageUrl}
          >
            <a href={project.href}>
              <Button
                variant="secondary"
                size="lg"
                className="mt-4 transition-all duration-300 group-hover/card:bg-blue-500 group-hover/card:text-white group-hover/card:border-blue-600 group-hover/card:scale-110"
              >
                View Project
              </Button>
            </a>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="primary"
          size="lg"
          className="mt-8"
        >
          View All Projects
        </Button>
      </div>
    </div>
  );
}
