import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogPage from '@/app/blog/page';
import BlogPost from '@/app/blog/[slug]/page';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock components
jest.mock('@/components/ui/Button', () => ({
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
      const blogGrid = screen.getByRole('list', { name: /blog posts/i });
      expect(blogGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    });

    it('should filter blog posts by category', async () => {
      render(<BlogPage />);
      const categoryFilter = screen.getByRole('combobox', { name: /filter by category/i });
      await userEvent.selectOptions(categoryFilter, 'technical');
      
      expect(screen.getByText(/filtered by: technical/i)).toBeInTheDocument();
      expect(screen.getAllByRole('article')).toHaveLength(3); // Assuming 3 technical posts
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
      render(<BlogPost slug="test-post" />);
      const codeBlock = screen.getByRole('code');
      expect(codeBlock).toHaveClass('language-typescript');
    });

    it('should allow copying code snippets', async () => {
      render(<BlogPost slug="test-post" />);
      const copyButton = screen.getByRole('button', { name: /copy code/i });
      await userEvent.click(copyButton);
      
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  describe('Blog Interaction Features', () => {
    it('should track reading progress', async () => {
      render(<BlogPost slug="test-post" />);
      const progressBar = screen.getByRole('progressbar');
      
      // Simulate scroll
      window.scrollY = window.innerHeight;
      window.dispatchEvent(new Event('scroll'));
      
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('should show estimated reading time', () => {
      render(<BlogPost slug="test-post" />);
      expect(screen.getByText(/\d+ min read/i)).toBeInTheDocument();
    });

    it('should navigate between related posts', async () => {
      render(<BlogPost slug="test-post" />);
      const nextPostLink = screen.getByRole('link', { name: /next post/i });
      await userEvent.click(nextPostLink);
      
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/blog/'));
    });
  });

  describe('Blog Social Features', () => {
    it('should share blog post on social media', async () => {
      render(<BlogPost slug="test-post" />);
      const shareButton = screen.getByRole('button', { name: /share/i });
      await userEvent.click(shareButton);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /share on/i })).toHaveLength(3);
    });

    it('should save post to reading list', async () => {
      render(<BlogPost slug="test-post" />);
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