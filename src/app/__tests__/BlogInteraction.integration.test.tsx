import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { describe, it, expect, vi } from 'vitest';
import BlogPage from '@/app/blog/page';
import styles from '@/app/blog/blog.module.css';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components
vi.mock('@/components/ui/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('Blog Interaction Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  describe('Blog Landing Page Navigation', () => {
    it('should display blog posts in a grid layout', async () => {
      render(<BlogPage />);
      const blogGrid = screen.getByTestId('blog-grid');
      expect(blogGrid).toHaveClass(styles.blogGrid);
    });

    it('should filter blog posts by category', async () => {
      render(<BlogPage />);
      const categoryButtons = screen.getAllByRole('button');
      const aiButton = categoryButtons.find(button => button.textContent === 'AI & Automation');
      
      await userEvent.click(aiButton!);
      
      const posts = screen.getAllByRole('article');
      expect(posts).toHaveLength(1); // We have 1 AI & Automation post
      expect(posts[0]).toHaveTextContent('AI in Business Automation');
    });

    it('should animate the category indicator', async () => {
      render(<BlogPage />);
      const indicator = screen.getByTestId('category-indicator');
      const initialPosition = indicator.style.left;
      
      const aiButton = screen.getByRole('button', { name: 'AI & Automation' });
      await userEvent.click(aiButton);
      
      expect(indicator.style.left).not.toBe(initialPosition);
    });

    it('should animate blog cards when filtering', async () => {
      render(<BlogPage />);
      const aiButton = screen.getByRole('button', { name: 'AI & Automation' });
      
      await userEvent.click(aiButton);
      
      const posts = screen.getAllByTestId('blog-card');
      posts.forEach(post => {
        expect(post).toHaveStyle('transform: translateX(0)');
      });
    });

    it('should search blog posts by title and content', async () => {
      render(<BlogPage />);
      const searchInput = screen.getByRole('searchbox', { name: /search blog posts/i });
      await userEvent.type(searchInput, 'React');
      
      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(2); // Assuming 2 posts about React
      });
    });
  });

  describe('Blog Post Reading Experience', () => {
    it('should navigate to full post when clicking on preview', async () => {
      render(<BlogPage />);
      const firstPost = screen.getAllByRole('article')[0];
      const postTitle = within(firstPost).getByRole('heading').textContent;
      
      await userEvent.click(firstPost);
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/blog/'));
    });

    it('should render code blocks with syntax highlighting', async () => {
      render(<BlogPage />);
      const codeBlock = screen.getByRole('code');
      expect(codeBlock).toHaveClass('language-typescript');
    });

    it('should allow copying code snippets', async () => {
      render(<BlogPage />);
      const copyButton = screen.getByRole('button', { name: /copy code/i });
      await userEvent.click(copyButton);
      
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  describe('Blog Interaction Features', () => {
    it('should track reading progress', async () => {
      render(<BlogPage />);
      const progressBar = screen.getByRole('progressbar');
      
      // Simulate scroll
      window.scrollY = window.innerHeight;
      window.dispatchEvent(new Event('scroll'));
      
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('should show estimated reading time', () => {
      render(<BlogPage />);
      expect(screen.getByText(/\d+ min read/i)).toBeInTheDocument();
    });

    it('should navigate between related posts', async () => {
      render(<BlogPage />);
      const nextPostLink = screen.getByRole('link', { name: /next post/i });
      await userEvent.click(nextPostLink);
      
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/blog/'));
    });
  });

  describe('Blog Social Features', () => {
    it('should share blog post on social media', async () => {
      render(<BlogPage />);
      const shareButton = screen.getByRole('button', { name: /share/i });
      await userEvent.click(shareButton);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /share on/i })).toHaveLength(3);
    });

    it('should save post to reading list', async () => {
      render(<BlogPage />);
      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);
      
      expect(screen.getByText(/saved to reading list/i)).toBeInTheDocument();
    });
  });

  describe('Blog Accessibility', () => {
    it('should navigate through posts using keyboard', async () => {
      render(<BlogPage />);
      const posts = screen.getAllByRole('article');
      
      await userEvent.tab();
      expect(posts[0]).toHaveFocus();
      
      await userEvent.tab();
      expect(posts[1]).toHaveFocus();
    });

    it('should announce new content when filtering', async () => {
      render(<BlogPage />);
      const categoryFilter = screen.getByRole('combobox', { name: /filter by category/i });
      await userEvent.selectOptions(categoryFilter, 'technical');
      
      expect(screen.getByRole('alert')).toHaveTextContent(/showing \d+ technical posts/i);
    });
  });
}); 