import { projects, testimonials } from '@/data/siteData';

const PLACEHOLDER_HOSTS = [
  'ui-avatars.com',
  'source.unsplash.com',
  'placehold.co',
];

function isPlaceholder(url: string) {
  return PLACEHOLDER_HOSTS.some(host => url.includes(host));
}

export function logPlaceholders() {
  // Projects
  projects.forEach((project, i) => {
    if (project.image && isPlaceholder(project.image)) {
      console.log(`[PLACEHOLDER] Project "${project.title}" image: ${project.image} (suggest: /projects/${project.slug}.jpg)`);
    }
    if (Array.isArray(project.images)) {
      project.images.forEach((img, idx) => {
        if (isPlaceholder(img)) {
          console.log(`[PLACEHOLDER] Project "${project.title}" images[${idx}]: ${img} (suggest: /projects/${project.slug}-${idx + 1}.jpg)`);
        }
      });
    }
  });

  // Testimonials
  testimonials.forEach((t, i) => {
    if (t.avatar && isPlaceholder(t.avatar)) {
      const safeName = t.name.toLowerCase().replace(/\s+/g, '-');
      console.log(`[PLACEHOLDER] Testimonial "${t.name}" avatar: ${t.avatar} (suggest: /images/testimonial-${safeName}.jpg)`);
    }
  });
} 