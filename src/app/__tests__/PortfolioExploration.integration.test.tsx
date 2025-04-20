import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Portfolio from '../portfolio/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock Card component to isolate tests
jest.mock('@/components/Card', () => {
  return function MockCard({ project }: { project: any }) {
    return (
      <div data-testid="project-card" className="project-card">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    );
  };
});

describe('Portfolio Exploration Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/portfolio');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  describe('Initial Portfolio View', () => {
    it('displays all projects with correct information', async () => {
      render(<Portfolio />);
      
      const projectCards = await screen.findAllByTestId('project-card');
      expect(projectCards).toHaveLength(4); // Based on the projects array in Portfolio.tsx
      
      const firstProject = within(projectCards[0]);
      expect(firstProject.getByRole('heading')).toHaveTextContent(/E-commerce Platform/i);
      expect(firstProject.getByText(/Next.js/i)).toBeInTheDocument();
    });

    it('applies correct grid layout for projects', () => {
      render(<Portfolio />);
      
      const projectGrid = screen.getByTestId('project-grid');
      expect(projectGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Project Filtering', () => {
    it('filters projects by tag', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);
      
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await user.type(filterInput, 'React');
      
      const projectCards = screen.getAllByTestId('project-card');
      projectCards.forEach(card => {
        const tags = within(card).getAllByText(/React/i);
        expect(tags.length).toBeGreaterThan(0);
      });
    });

    it('shows no results message when no projects match filter', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);
      
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await user.type(filterInput, 'NonexistentTag');
      
      expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    });
  });

  describe('Project Details Interaction', () => {
    it('opens project details modal on card click', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);
      
      const firstProject = screen.getAllByTestId('project-card')[0];
      await user.click(firstProject);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/E-commerce Platform/i);
    });

    it('preserves filter state after closing project details', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);
      
      // Apply filter
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await user.type(filterInput, 'React');
      
      // Open and close project details
      const firstProject = screen.getAllByTestId('project-card')[0];
      await user.click(firstProject);
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      // Verify filter is still applied
      expect(filterInput).toHaveValue('React');
      const projectCards = screen.getAllByTestId('project-card');
      expect(projectCards.length).toBeGreaterThan(0);
    });
  });

  describe('URL State Management', () => {
    it('updates URL with filter parameters', async () => {
      const user = userEvent.setup();
      render(<Portfolio />);
      
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      await user.type(filterInput, 'React');
      
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining('filter=React')
      );
    });

    it('restores filter state from URL parameters', () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams('filter=React')
      );
      
      render(<Portfolio />);
      
      const filterInput = screen.getByPlaceholderText(/filter projects/i);
      expect(filterInput).toHaveValue('React');
    });
  });
}); 
}); 