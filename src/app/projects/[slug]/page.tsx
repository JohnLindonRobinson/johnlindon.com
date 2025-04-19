import { Metadata } from 'next';
import Image from 'next/image';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // In a real implementation, you would fetch this data from your CMS or data source
  const project = {
    title: 'TCQuick - Tutoring Center Management System',
    description:
      'A comprehensive system for managing tutoring centers, student progress, and scheduling.',
  };

  return {
    title: `${project.title} | John Robinson`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // In a real implementation, you would fetch this data from your CMS or data source
  const project = {
    title: 'TCQuick',
    description:
      'A comprehensive system for managing tutoring centers, student progress, and scheduling.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    features: [
      'Student progress tracking',
      'Class scheduling and management',
      'Attendance tracking',
      'Payment processing',
      'Parent portal',
      'Teacher dashboard',
    ],
    imageUrl: '/projects/tcquick-dashboard.png',
    year: '2024',
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-primary">{project.title}</h1>

        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={`${project.title} dashboard`}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-text mb-6">{project.description}</p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Key Features</h2>
            <ul className="list-disc pl-6 text-text">
              {project.features.map(feature => (
                <li key={feature} className="mb-2">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-primary/10 pt-8">
            <p className="text-sm text-text/60">Project completed in {project.year}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
