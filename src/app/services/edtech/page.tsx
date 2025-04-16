import Button from '@/components/Button'

export default function EdTechService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Education Tech & Tutoring Systems
        </h1>
        <p className="text-xl text-gray-600">
          Custom tools for educators and edtech startups
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>What I Offer</h2>
        <p>
          I create specialized educational technology solutions for tutors,
          tuition centers, and edtech startups. My tools help streamline
          teaching processes, track student progress, and enhance learning
          outcomes.
        </p>

        <h2>Key Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Teaching Tools</h3>
            <ul className="list-disc pl-4">
              <li>Curriculum development tools</li>
              <li>Pseudocode engines</li>
              <li>Interactive learning materials</li>
              <li>Assessment generators</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Management Systems</h3>
            <ul className="list-disc pl-4">
              <li>Student progress tracking</li>
              <li>Lesson planning tools</li>
              <li>Resource management</li>
              <li>Parent communication portals</li>
            </ul>
          </div>
        </div>

        <h2>Expertise Areas</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Curriculum Development</h3>
          <ul className="list-disc pl-6">
            <li>GCSE and A-Level Computer Science</li>
            <li>Mathematics curriculum design</li>
            <li>Assessment content creation</li>
            <li>Learning resource development</li>
          </ul>
        </div>

        <h2>Implementation Process</h2>
        <ol>
          <li>
            <strong>Needs Assessment:</strong> We identify your specific
            educational challenges and requirements
          </li>
          <li>
            <strong>Solution Design:</strong> I create a tailored system that
            addresses your needs
          </li>
          <li>
            <strong>Development:</strong> I build and test the educational tools
          </li>
          <li>
            <strong>Training:</strong> I provide guidance on using the new
            system
          </li>
          <li>
            <strong>Support:</strong> Ongoing assistance and system updates
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Button
          href="/contact"
          variant="primary"
          size="lg"
        >
          Enhance Your Teaching
        </Button>
      </div>
    </div>
  )
} 