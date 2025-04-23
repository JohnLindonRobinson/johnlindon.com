'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BlogCard from '@/components/BlogCard'
import { IoClose } from 'react-icons/io5'
import styles from './blog.module.css'

export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  image: string
  category: string
  date: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    description: 'Exploring emerging trends and technologies shaping the future of web development, from AI integration to WebAssembly and edge computing.',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    In the rapidly evolving landscape of web development, several key trends are emerging:

    1. AI-Powered Development Tools
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut vehicula lorem pellentesque vel. Aliquam erat volutpat. Vivamus lobortis sem ut interdum vestibulum.

    2. WebAssembly and Performance
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    3. Edge Computing
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.

    The Future Outlook
    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.`,
    image: 'https://placehold.co/1200x800/6B21A8/FFFFFF/webp?text=Web+Development',
    category: 'Web Development',
    date: 'March 15, 2024',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'AI in Business Automation',
    description: 'How artificial intelligence is revolutionizing business process automation and transforming workplace efficiency.',
    content: `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Key Areas of AI Automation:

    1. Process Automation
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.

    2. Data Analysis and Insights
    Ut pharetra sit amet aliquam id diam maecenas ultricies. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Sit amet tellus cras adipiscing enim eu turpis egestas pretium.

    3. Customer Service Enhancement
    Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Id semper risus in hendrerit gravida rutrum quisque non. Amet consectetur adipiscing elit pellentesque habitant morbi tristique.

    Implementation Strategies
    Feugiat in fermentum posuere urna nec tincidunt praesent semper. Ultrices sagittis orci a scelerisque purus semper eget. Dictum sit amet justo donec enim diam vulputate ut pharetra.

    Future Implications
    Nibh ipsum consequat nisl vel pretium lectus quam id leo. Vitae congue eu consequat ac felis donec et odio pellentesque. Sit amet dictum sit amet justo donec enim diam vulputate.`,
    image: 'https://placehold.co/1200x800/6B21A8/FFFFFF/webp?text=AI+Automation',
    category: 'AI & Automation',
    date: 'March 10, 2024',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Building Better Education Systems',
    description: 'Leveraging technology to create more effective and engaging learning experiences in modern education.',
    content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

    Transforming Education Through Technology:

    1. Personalized Learning Paths
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac diam.

    2. Interactive Learning Tools
    Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Duis condimentum augue id magna semper rutrum. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit.

    3. Data-Driven Assessment
    Morbi leo mi, nonummy eget, tristique non, rhoncus non, leo. Nullam faucibus mi quis velit. Integer in sapien. Fusce tellus odio, dapibus id, fermentum quis, suscipit id, erat.

    Implementation Challenges
    Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat non orci commodo lobortis. Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.

    Success Stories
    Ut tellus dolor, dapibus eget, elementum vel, cursus eleifend, elit. Aenean auctor wisi et urna. Aliquam erat volutpat. Duis ac turpis. Integer rutrum ante eu lacus.`,
    image: 'https://placehold.co/1200x800/6B21A8/FFFFFF/webp?text=Education+Tech',
    category: 'Education',
    date: 'March 5, 2024',
    readTime: '6 min read'
  }
]

const categories = ['All', 'Web Development', 'AI & Automation', 'Education']

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 })
  const filterWrapperRef = useRef<HTMLDivElement>(null)

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  useEffect(() => {
    const updateIndicator = () => {
      const wrapper = filterWrapperRef.current
      if (!wrapper) return

      const activeButton = wrapper.querySelector(`button[data-category="${selectedCategory}"]`) as HTMLElement
      if (!activeButton) return

      const wrapperBounds = wrapper.getBoundingClientRect()
      const buttonBounds = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        width: buttonBounds.width,
        left: buttonBounds.left - wrapperBounds.left
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [selectedCategory])

  return (
    <div className={styles.blogContainer}>
      <div className={styles.backgroundLogo} />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore insights and experiences in web development, AI automation, and educational technology.
        </p>
      </div>

      <div className={styles.filterBar}>
        <div ref={filterWrapperRef} className={styles.filterWrapper}>
          <div
            data-testid="category-indicator"
            className={styles.indicator}
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left
            }}
          />
          {categories.map(category => (
            <button
              key={category}
              data-category={category}
              data-active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className="relative z-10 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className={styles.blogGrid}
        data-testid="blog-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence initial={false} mode="sync">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              data-testid="blog-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                type: "tween",
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{ 
                position: 'relative',
                willChange: 'transform, opacity'
              }}
            >
              <BlogCard post={post} onClick={() => setSelectedPost(post)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              className={styles.modal}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className={styles.closeButton}
              >
                <IoClose />
              </button>
              
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className={styles.modalImage}
              />
              
              <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{selectedPost.title}</h2>
                <div className={styles.modalMeta}>
                  <span>{selectedPost.category}</span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <p className={styles.modalDescription}>{selectedPost.description}</p>
                <div className="mt-4 whitespace-pre-line">{selectedPost.content}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}