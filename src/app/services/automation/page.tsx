import Button from '@/components/ui/Button';

export default function AutomationService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Business Automation & Internal Tooling
        </h1>
        <p className="text-xl text-gray-600">
          Streamline your operations with custom automation solutions
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I create custom scripts and integrations that eliminate manual workflows, improve
          accuracy, and free up valuable time. My solutions are tailored to your specific business
          needs and integrate seamlessly with your existing tools and processes.
        </p>

        <h2>Key Areas of Expertise</h2>
        <ul>
          <li>
            <strong>Xero API Integration:</strong> Automate accounting processes, sync inventory,
            and generate reports
          </li>
          <li>
            <strong>Zapier Workflows:</strong> Connect your apps and automate repetitive tasks
          </li>
          <li>
            <strong>EmailJS Automation:</strong> Streamline communication and notifications
          </li>
          <li>
            <strong>Google Apps Script:</strong> Custom solutions for Google Workspace
          </li>
        </ul>

        <h2>Example Projects</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">TCQuick Fulfillment Platform</h3>
          <ul className="list-disc pl-6">
            <li>Automated packing slips and label generation</li>
            <li>Xero API integration for VAT reporting</li>
            <li>Inventory sync and management</li>
            <li>Reduced fulfillment time by 65%</li>
            <li>Scaled business 3x without new hires</li>
          </ul>
        </div>

        <h2>How It Works</h2>
        <ol>
          <li>
            <strong>Discovery:</strong> We discuss your current processes and identify automation
            opportunities
          </li>
          <li>
            <strong>Design:</strong> I create a detailed plan for the automation solution
          </li>
          <li>
            <strong>Development:</strong> I build and test the automation solution
          </li>
          <li>
            <strong>Deployment:</strong> We implement the solution and ensure it works seamlessly
          </li>
          <li>
            <strong>Support:</strong> Ongoing maintenance and updates as needed
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Button href="/contact" variant="primary" size="lg">
          Get Started with Automation
        </Button>
      </div>
    </div>
  );
}
