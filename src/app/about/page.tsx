import Button from '@/components/Button'
import Image from 'next/image'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Me
        </h1>
        <p className="text-xl text-gray-600">
          Freelance Developer & Systems Consultant
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="prose prose-lg max-w-none">
            <h2>Background</h2>
            <p>
              I'm a freelance developer and systems consultant with a passion for
              creating efficient, scalable solutions that solve real business problems.
              With over 5 years of experience across multiple industries including e-commerce,
              education, and financial technology, I bring a unique perspective to
              every project.
            </p>
            <p>
              My journey in technology began with a fascination for automation and
              efficiency. This led me to specialize in creating custom solutions that
              streamline business operations, from automated trading systems to
              educational platforms. I've worked with startups, small businesses,
              and educational institutions, helping them leverage technology to
              achieve their goals.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <Image
              src="/images/profile.jpg"
              alt="John Robinson"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Connect with me on:</p>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://github.com/JohnLindonRobinson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub Profile"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/johnlindonrobinson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="mailto:john@johnlindon.com"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Email"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2>Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Technical Skills</h3>
            <ul className="list-disc pl-4">
              <li>Full-stack web development (React, TypeScript, Node.js)</li>
              <li>Database design (PostgreSQL, MongoDB)</li>
              <li>API development and integration</li>
              <li>Cloud infrastructure and deployment</li>
              <li>Automation and workflow optimization</li>
              <li>CI/CD and DevOps practices</li>
              <li>Testing and quality assurance</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Domain Expertise</h3>
            <ul className="list-disc pl-4">
              <li>E-commerce and fulfillment systems</li>
              <li>Educational technology and tutoring platforms</li>
              <li>Financial technology and trading systems</li>
              <li>Game logic and strategy analysis</li>
              <li>Productivity and workflow optimization</li>
              <li>Notion and productivity systems</li>
              <li>Custom automation solutions</li>
            </ul>
          </div>
        </div>

        <h2>Approach</h2>
        <p>
          I believe in a collaborative, iterative approach to development. Each
          project starts with understanding your unique needs and challenges,
          followed by careful planning and execution. I focus on creating
          maintainable, scalable solutions that grow with your business.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-4">Why Work With Me?</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>End-to-End Solutions:</strong> From initial concept to
              deployment and maintenance
            </li>
            <li>
              <strong>Clear Communication:</strong> Regular updates and
              transparent progress tracking
            </li>
            <li>
              <strong>Quality Focus:</strong> Emphasis on clean, maintainable code
              and best practices
            </li>
            <li>
              <strong>Scalable Architecture:</strong> Solutions designed to grow
              with your business
            </li>
            <li>
              <strong>Ongoing Support:</strong> Continued assistance and updates
              after project completion
            </li>
          </ul>
        </div>

        <h2>Education & Certifications</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-4">
            <li>Computer Science Degree</li>
            <li>Certified Full-Stack Developer</li>
            <li>Cloud Architecture Certification</li>
            <li>Ongoing professional development in emerging technologies</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button
          href="/contact"
          variant="primary"
          size="lg"
        >
          Let's Work Together
        </Button>
      </div>
    </div>
  )
} 