import { Button } from '@/components/ui/button';

export default function ConsultingService() {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Systems & Process Consulting</h1>
        <p className="text-xl text-gray-600">
          Strategic solutions for business optimization and growth
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I help businesses identify inefficiencies, design optimized workflows, and implement
          technical solutions that drive growth. My consulting approach combines technical expertise
          with business acumen to deliver measurable results.
        </p>

        <h2>Areas of Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Process Optimization</h3>
            <ul className="list-disc pl-4">
              <li>Workflow analysis and mapping</li>
              <li>System integration planning</li>
              <li>Automation opportunities</li>
              <li>KPI development and tracking</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Technical Strategy</h3>
            <ul className="list-disc pl-4">
              <li>Technology stack assessment</li>
              <li>Integration architecture</li>
              <li>Scalability planning</li>
              <li>Security best practices</li>
            </ul>
          </div>
        </div>

        <h2>Example Projects</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">E-commerce Operations Overhaul</h3>
          <ul className="list-disc pl-6">
            <li>End-to-end workflow analysis</li>
            <li>Custom automation implementation</li>
            <li>Integration of multiple systems</li>
            <li>Staff training and documentation</li>
            <li>Ongoing optimization support</li>
          </ul>
        </div>

        <h2>Consulting Process</h2>
        <ol>
          <li>
            <strong>Discovery:</strong> Understanding your business, goals, and current challenges
          </li>
          <li>
            <strong>Analysis:</strong> Detailed review of systems, processes, and opportunities
          </li>
          <li>
            <strong>Strategy:</strong> Developing a comprehensive improvement plan
          </li>
          <li>
            <strong>Implementation:</strong> Executing solutions and tracking results
          </li>
          <li>
            <strong>Review:</strong> Measuring impact and making adjustments
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <a href="/contact">
          <Button variant="primary" size="lg">
            Schedule a Consultation
          </Button>
        </a>
      </div>
    </div>
  );
} 