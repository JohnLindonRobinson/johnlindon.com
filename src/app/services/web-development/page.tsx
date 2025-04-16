import Button from '@/components/Button'

export default function WebDevelopmentService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Full-Stack Web App Development
        </h1>
        <p className="text-xl text-gray-600">
          Modern, scalable applications built with cutting-edge technology
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I build robust, maintainable web applications using modern technologies
          and best practices. Whether you need an MVP, internal dashboard, or
          production-ready application, I can help bring your vision to life.
        </p>

        <h2>Technical Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Frontend</h3>
            <ul className="list-disc pl-4">
              <li>React with TypeScript</li>
              <li>Tailwind CSS for styling</li>
              <li>Framer Motion for animations</li>
              <li>Headless UI components</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Backend</h3>
            <ul className="list-disc pl-4">
              <li>Node.js or Deno</li>
              <li>PostgreSQL or MongoDB</li>
              <li>RESTful APIs</li>
              <li>Docker for deployment</li>
            </ul>
          </div>
        </div>

        <h2>Example Projects</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">BullSheet – Stock Trading Simulator</h3>
          <ul className="list-disc pl-6">
            <li>Deno backend with React/TypeScript frontend</li>
            <li>PostgreSQL database with Docker</li>
            <li>Paper trading and market data charts</li>
            <li>Financial news aggregator</li>
            <li>Performance optimization and metrics tracking</li>
          </ul>
        </div>

        <h2>Development Process</h2>
        <ol>
          <li>
            <strong>Planning:</strong> We define requirements, user stories, and
            technical specifications
          </li>
          <li>
            <strong>Design:</strong> I create wireframes and design the database
            schema
          </li>
          <li>
            <strong>Development:</strong> I build the application using agile
            methodologies
          </li>
          <li>
            <strong>Testing:</strong> We ensure quality through automated tests
            and manual review
          </li>
          <li>
            <strong>Deployment:</strong> I help you deploy to production and
            monitor performance
          </li>
        </ol>
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