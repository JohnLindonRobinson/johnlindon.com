import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from '@/app/blog/blog.module.css';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  return (
    <motion.div
      className="bg-white/80 rounded-xl border border-primary/10 shadow-sm cursor-pointer transition-all duration-300 h-full overflow-hidden transform-gpu hover:scale-105 hover:shadow-md hover:border-primary/20"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-32 mb-4 bg-gradient-to-br from-purple-100/60 to-white/60 flex items-center justify-center">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-t-xl opacity-90"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug mb-1 text-gray-900">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {post.description}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          {post.date}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard; 