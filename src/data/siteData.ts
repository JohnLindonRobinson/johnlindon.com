// Centralized site data for johnlindon.com

export type Specialisation = string;
export type Tag = string;

export interface HeroData {
  name: string;
  headline: string;
  subtitle: string;
  specialisations: Specialisation[];
  profileImage: string;
}

export interface Service {
  title: string;
  summary: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: Tag[];
  image: string;
  href: string;
  category: string;
  backgroundIcon: string;
  // Optional fields for modal compatibility
  contentHtml?: string;
  emoji?: string;
  images?: string[];
  facts?: string[];
  factTooltips?: string[];
  links?: any[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  link?: string;
}

export const heroData: HeroData = {
  name: 'John Lindon',
  headline: 'Plan and build your next product with a',
  subtitle: 'Freelance Developer & Systems Consultant.',
  specialisations: ['React', 'Next.js', 'TypeScript'],
  profileImage: '/images/ConwyMaths-5-remove-background.com.png',
};

export const services: Service[] = [
  {
    title: 'Frontend Development',
    summary: 'Building beautiful, responsive web applications',
    description: 'Modern web development with React, Next.js, and TypeScript. Focus on performance, accessibility, and user experience.',
    icon: '/images/service-icon.svg',
  },
  {
    title: 'Backend Integration',
    summary: 'Connecting your frontend to powerful services',
    description: 'Seamless integration with APIs, databases, and third-party services. Building robust, scalable backend solutions.',
    icon: '/images/service-icon.svg',
  },
  {
    title: 'UI/UX Implementation',
    summary: 'Bringing designs to life with precision',
    description: 'Pixel-perfect implementation of designs, with smooth animations and interactions. Focus on maintainable, semantic code.',
    icon: '/images/service-icon.svg',
  },
];
export const projects: Project[] = [
  {
    id: '1',
    slug: 'bullsheet',
    title: 'BullSheet',
    subtitle: 'Paper Trading with Market Sentiment',
    description: 'A stock trading simulator with news-based sentiment tracking, built with Deno, React, and PostgreSQL.',
    tags: ['Deno', 'React', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    image: '/images/projects/bullsheet.png',
    href: '/projects/bullsheet',
    category: 'Web Apps',
    backgroundIcon: '📈',
    emoji: '🐂',
    facts: ['Built 2025', 'Uses historical market data', 'Full-stack TypeScript'],
    factTooltips: ['Year created', 'Simulates market trends', 'Type safety throughout stack'],
  },
  {
    id: '2',
    slug: 'task-manager',
    title: 'Task Manager (GTD)',
    subtitle: 'Get Things Done with Simplicity',
    description: 'A GTD-inspired task manager supporting JSON input and structured tagging.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'GTD'],
    image: '/images/projects/task-manager.png',
    href: '/projects/task-manager',
    category: 'Web Apps',
    backgroundIcon: '✅',
    emoji: '🧠',
    facts: ['Inspired by David Allen', 'Flexible JSON schema', 'Built 2024'],
    factTooltips: ['Productivity methodology', 'Custom task format', 'Date completed'],
  },
  {
    id: '3',
    slug: 'stock-trading-api',
    title: 'Stock Trading API',
    subtitle: 'Trade Simulator for System Design',
    description: 'A RESTful API and frontend for simulating stock orders, designed for a system design interview.',
    tags: ['Django', 'Flask', 'React', 'TypeScript', 'REST'],
    image: '/images/projects/stock-api.png',
    href: '/projects/stock-trading-api',
    category: 'Dev Tools',
    backgroundIcon: '💹',
    emoji: '📦',
    facts: ['System design challenge', 'Order/portfolio logic', 'Fast prototyping'],
    factTooltips: ['Interview prep', 'Financial data handling', 'Rapid build'],
  },
  {
    id: '4',
    slug: 'johnlindon-portfolio',
    title: 'johnlindon.com',
    subtitle: 'Freelance Portfolio Website',
    description: 'Personal site to showcase services, projects, and blog. Built with modern frontend tech and motion-first design.',
    tags: ['Next.js', 'Tailwind', 'Prisma', 'TypeScript', 'Vercel'],
    image: '/images/projects/portfolio.png',
    href: '/projects/johnlindon',
    category: 'Web Apps',
    backgroundIcon: '🌐',
    emoji: '👨‍💻',
    facts: ['Deployed to Vercel', 'Fully animated UI', 'Designed in Figma'],
    factTooltips: ['Hosting provider', 'UX emphasis', 'Visual planning tool'],
  },
  {
    id: '5',
    slug: 'ai-vanguard',
    title: 'AI for Cardfight!! Vanguard',
    subtitle: 'Evolution-Based Game Strategy Bot',
    description: 'Python-based AI that learns optimal strategies in Cardfight!! Vanguard using evolutionary algorithms.',
    tags: ['Python', 'AI', 'Games', 'Simulation'],
    image: '/images/projects/vanguard-ai.png',
    href: '/projects/ai-vanguard',
    category: 'AI & Automation',
    backgroundIcon: '🎴',
    emoji: '🧬',
    facts: ['Uses mutation/selection', 'Cardgame-specific logic', 'Built in Cursor'],
    factTooltips: ['Genetic algorithms', 'Game AI focus', 'Code editor used'],
  },
  {
    id: '6',
    slug: 'mtg-advisor',
    title: 'Magic: The Gathering Advisor',
    subtitle: 'Optimal Move Finder from JSON Game State',
    description: 'Analyzes JSON-based board states and decklists to suggest ideal plays in complex MTG scenarios.',
    tags: ['MTG', 'Game AI', 'JSON', 'Python'],
    image: '/images/projects/mtg-advisor.png',
    href: '/projects/mtg-advisor',
    category: 'AI & Automation',
    backgroundIcon: '🃏',
    emoji: '🧙',
    facts: ['Decklist-aware', 'Game tree logic', 'Under development'],
    factTooltips: ['Uses deck data', 'Searches optimal plays', 'Project status'],
  },
  {
    id: '7',
    slug: 'vat-xero-automation',
    title: 'VAT Automation with Xero',
    subtitle: 'Business Workflow Enhancement',
    description: 'Custom scripts for order management, VAT reporting, and financial compliance using Xero and internal tools.',
    tags: ['Xero', 'VAT', 'Automation', 'Business'],
    image: '/images/projects/vat-xero.png',
    href: '/projects/vat-xero-automation',
    category: 'Dev Tools',
    backgroundIcon: '📑',
    emoji: '📊',
    facts: ['Used in TCQuick', 'Real-world finance', 'Automates reports'],
    factTooltips: ['Personal company', 'Accounting context', 'Business ops'],
  }
];


export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Lee',
    role: 'Product Manager',
    company: 'Acme Corp',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=8b5cf6&color=fff&size=128',
    quote: 'Working with John was a game-changer. His attention to detail and ability to deliver on time exceeded our expectations.',
    link: 'https://www.linkedin.com/in/sarahlee'
  },
  {
    name: 'David Kim',
    role: 'CTO',
    company: 'EduTech',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=8b5cf6&color=fff&size=128',
    quote: 'John brought our vision to life with clean, scalable code and a fantastic user experience. Highly recommended!'
  },
  {
    name: 'Priya Patel',
    role: 'Founder',
    company: 'Startly',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=8b5cf6&color=fff&size=128',
    quote: 'Professional, creative, and reliable. John is my go-to developer for all our projects.',
    link: 'https://startly.com/about'
  }
]; 