import Link from "next/link";

// Temporary blog post data - this would typically come from a CMS or API
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    excerpt: "Learn how to build modern web applications with Next.js 14 and its new features.",
    date: "2024-03-15",
    slug: "getting-started-nextjs-14"
  },
  {
    id: 2,
    title: "The Power of TypeScript in Frontend Development",
    excerpt: "Discover how TypeScript can improve your development workflow and catch errors early.",
    date: "2024-03-10",
    slug: "typescript-frontend-development"
  },
  {
    id: 3,
    title: "Building Accessible Web Applications",
    excerpt: "Best practices for creating web applications that are accessible to everyone.",
    date: "2024-03-05",
    slug: "building-accessible-web-apps"
  }
];

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-manrope font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="border-b border-gray-200 pb-8">
            <Link href={`/blog/${post.slug}`} className="block group">
              <time className="text-sm text-gray-500">{post.date}</time>
              <h2 className="text-2xl font-manrope font-semibold mt-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
              <span className="inline-block mt-4 text-primary font-medium">
                Read more →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
} 