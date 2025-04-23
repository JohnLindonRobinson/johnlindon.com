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
      className={styles.blogCard}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-48 mb-4">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-purple-600 font-medium">
            {post.category}
          </span>
          <span className="text-sm text-gray-500">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {post.description}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {post.date}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard; 