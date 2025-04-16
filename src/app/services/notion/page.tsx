import Button from '@/components/Button'

export default function NotionService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Notion Systems & Productivity Consulting
        </h1>
        <p className="text-xl text-gray-600">
          Streamline your workflows with custom Notion systems
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I help teams and individuals optimize their workflows by creating
          custom Notion systems that integrate with their existing tools and
          processes. From CRMs to knowledge bases, I build solutions that
          improve productivity and organization.
        </p>

        <h2>Key Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Business Systems</h3>
            <ul className="list-disc pl-4">
              <li>Custom CRM solutions</li>
              <li>Project management templates</li>
              <li>Knowledge management systems</li>
              <li>Team collaboration spaces</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Integrations</h3>
            <ul className="list-disc pl-4">
              <li>Zapier workflows</li>
              <li>Google Workspace sync</li>
              <li>Email automation</li>
              <li>Calendar integration</li>
            </ul>
          </div>
        </div>

        <h2>Example Projects</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tutor Admin Suite</h3>
          <ul className="list-disc pl-6">
            <li>Lesson tracking and scheduling</li>
            <li>Student progress monitoring</li>
            <li>Invoice and payment tracking</li>
            <li>Google Calendar and Gmail integration</li>
            <li>Feedback and assessment system</li>
          </ul>
        </div>

        <h2>Implementation Process</h2>
        <ol>
          <li>
            <strong>Discovery:</strong> We analyze your current workflows and
            identify improvement opportunities
          </li>
          <li>
            <strong>Design:</strong> I create a custom Notion system tailored to
            your needs
          </li>
          <li>
            <strong>Development:</strong> I build and configure your Notion
            workspace
          </li>
          <li>
            <strong>Training:</strong> I provide guidance on using the new system
          </li>
          <li>
            <strong>Support:</strong> Ongoing assistance and system updates as
            needed
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Button
          href="/contact"
          variant="primary"
          size="lg"
        >
          Transform Your Workflow
        </Button>
      </div>
    </div>
  )
} 