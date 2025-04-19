import Button from '@/components/Button'
import Card from '@/components/Card'

const projects = [
  {
    title: 'TCQuick – E-Commerce Fulfillment Platform',
    description: 'A comprehensive platform for order fulfillment, VAT compliance, and internal tooling. Reduced fulfillment time by 65% and enabled 3x business growth without additional hires.',
    tags: ['Automation', 'Xero API', 'E-commerce', 'VAT Compliance', 'Inventory Management'],
    href: '/portfolio/tcquick',
    imageUrl: '/images/tcquick.jpg' // Changed from image to imageUrl
  },
  {
    title: 'BullSheet – Stock Trading Simulator',
    description: 'A sophisticated stock trading simulator with paper trading, financial news aggregation, and market data charts. Built with Deno, React, TypeScript, and PostgreSQL.',
    tags: ['Deno', 'React', 'TypeScript', 'PostgreSQL', 'Financial Tech'],
    href: '/portfolio/bullsheet',
    imageUrl: '/images/bullsheet.jpg' // Changed from image to imageUrl
  },
  {
    title: 'MTG Analyzer',
    description: 'An advanced tool for parsing JSON-based game states and suggesting optimal plays. Features deck analysis and heuristic evaluation for strategic decision-making.',
    tags: ['Game Development', 'JSON', 'Logic', 'Strategy', 'Analysis'],
    href: '/portfolio/mtg-analyzer',
    imageUrl: '/images/mtg-analyzer.jpg' // Changed from image to imageUrl
  },
  {
    title: 'Tutor Admin Suite',
    description: 'A comprehensive Notion and Google Workspace integration for managing tutoring businesses. Tracks lessons, student progress, invoices, and feedback.',
    tags: ['Notion', 'Google Workspace', 'Education', 'CRM', 'Automation'],
    href: '/portfolio/tutor-admin',
    imageUrl: '/images/tutor-admin.jpg' // Changed from image to imageUrl
  }
]

export default function Portfolio() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Portfolio
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore my recent projects and see how I've helped clients solve complex
          problems with custom solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card
            key={project.title}
            title={project.title}
            description={project.description}
            tags={project.tags}
            href={project.href}
            imageUrl={project.imageUrl}
          >
            <Button
              href={project.href}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              View Project
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          href="/contact"
          variant="primary"
          size="lg"
        >
          Start Your Project
        </Button>
      </div>
    </div>
  )
} 