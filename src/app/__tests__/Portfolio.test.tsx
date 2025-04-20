import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portfolio from '../portfolio/page';
import { fireEvent } from '@testing-library/react';

// Mock the Card component since we're testing it separately
jest.mock('@/components/Card', () => {
  return function MockCard({ title, description, tags, children }: any) {
    return (
      <div data-testid="project-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div data-testid="tags">
          {tags.map((tag: string) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {children}
      </div>
    );
  };
});

// Mock the Button component
jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, href, variant, size }: any) {
    return (
      <button data-testid="button" data-href={href} data-variant={variant} data-size={size}>
        {children}
      </button>
    );
  };
});

describe('Portfolio Page', () => {
  it('renders the portfolio heading and description', () => {
    render(<Portfolio />);
    
    expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByText(/explore my recent projects/i)).toBeInTheDocument();
  });

  it('displays all project cards', () => {
    render(<Portfolio />);
    
    // Check for specific project titles
    expect(screen.getByText('TCQuick – E-Commerce Fulfillment Platform')).toBeInTheDocument();
    expect(screen.getByText('BullSheet – Stock Trading Simulator')).toBeInTheDocument();
    expect(screen.getByText('MTG Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Tutor Admin Suite')).toBeInTheDocument();
  });

  it('renders project cards with correct content', () => {
    render(<Portfolio />);
    
    // Test the first project card in detail
    const tcquickCard = screen.getByText('TCQuick – E-Commerce Fulfillment Platform').closest('div');
    expect(tcquickCard).toBeInTheDocument();
    
    // Check for description
    expect(screen.getByText(/A comprehensive platform for order fulfillment/i)).toBeInTheDocument();
    
    // Check for tags
    expect(screen.getByText('Automation')).toBeInTheDocument();
    expect(screen.getByText('Xero API')).toBeInTheDocument();
    
    // Check for View Project button
    const viewProjectButton = screen.getAllByText('View Project')[0];
    expect(viewProjectButton).toBeInTheDocument();
    expect(viewProjectButton.closest('a')).toHaveAttribute('href', '/portfolio/tcquick');
  });

  it('renders the Start Your Project button with correct link', () => {
    render(<Portfolio />);
    
    const startProjectButton = screen.getByText('Start Your Project');
    expect(startProjectButton).toBeInTheDocument();
    expect(startProjectButton.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('has correct grid layout classes for responsive design', () => {
    render(<Portfolio />);
    
    const grid = screen.getByRole('heading', { name: /portfolio/i }).parentElement?.parentElement;
    expect(grid?.querySelector('.grid')).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  // Project Card Content Tests
  describe('Project Card Content', () => {
    beforeEach(() => {
      render(<Portfolio />);
    });

    it('displays correct project titles', () => {
      expect(screen.getByText('TCQuick – E-Commerce Fulfillment Platform')).toBeInTheDocument();
      expect(screen.getByText('BullSheet – Stock Trading Simulator')).toBeInTheDocument();
      expect(screen.getByText('MTG Analyzer')).toBeInTheDocument();
      expect(screen.getByText('Tutor Admin Suite')).toBeInTheDocument();
    });

    it('shows project descriptions', () => {
      const descriptions = [
        /comprehensive platform for order fulfillment/i,
        /sophisticated stock trading simulator/i,
        /advanced tool for parsing JSON-based game states/i,
        /comprehensive Notion and Google Workspace integration/i,
      ];

      descriptions.forEach(desc => {
        expect(screen.getByText(desc)).toBeInTheDocument();
      });
    });

    it('displays project tags', () => {
      const tagContainers = screen.getAllByTestId('tags');
      const expectedTags = [
        ['Automation', 'Xero API', 'E-commerce', 'VAT Compliance', 'Inventory Management'],
        ['Deno', 'React', 'TypeScript', 'PostgreSQL', 'Financial Tech'],
        ['Game Development', 'JSON', 'Logic', 'Strategy', 'Analysis'],
        ['Notion', 'Google Workspace', 'Education', 'CRM', 'Automation'],
      ];

      tagContainers.forEach((container, index) => {
        expectedTags[index].forEach(tag => {
          expect(within(container).getByText(tag)).toBeInTheDocument();
        });
      });
    });
  });

  // Layout and Responsive Tests
  describe('Layout and Responsive Design', () => {
    it('applies correct grid layout classes', () => {
      render(<Portfolio />);
      const gridContainer = screen.getByRole('list') || screen.getByRole('grid');
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });
  });

  // Navigation Tests
  describe('Navigation and Interaction', () => {
    it('project cards have correct navigation links', () => {
      render(<Portfolio />);
      const viewProjectButtons = screen.getAllByText('View Project');
      const expectedHrefs = [
        '/portfolio/tcquick',
        '/portfolio/bullsheet',
        '/portfolio/mtg-analyzer',
        '/portfolio/tutor-admin',
      ];

      viewProjectButtons.forEach((button, index) => {
        expect(button.getAttribute('data-href')).toBe(expectedHrefs[index]);
      });
    });

    it('CTA button navigates to contact page', () => {
      render(<Portfolio />);
      const ctaButton = screen.getByText('Start Your Project');
      expect(ctaButton.getAttribute('data-href')).toBe('/contact');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has correct heading hierarchy', () => {
      render(<Portfolio />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(/portfolio/i);
    });

    it('provides accessible names for all interactive elements', () => {
      render(<Portfolio />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles window resize events', () => {
      const { container } = render(<Portfolio />);
      
      // Simulate window resize
      window.innerWidth = 375; // Mobile width
      fireEvent(window, new Event('resize'));
      expect(container.querySelector('.grid')).toHaveClass('grid-cols-1');
      
      window.innerWidth = 1024; // Desktop width
      fireEvent(window, new Event('resize'));
      expect(container.querySelector('.grid')).toHaveClass('lg:grid-cols-3');
    });

    it('handles rapid navigation between projects', () => {
      render(<Portfolio />);
      
      const viewProjectButtons = screen.getAllByText('View Project');
      
      // Simulate rapid clicks on different project links
      fireEvent.click(viewProjectButtons[0]);
      fireEvent.click(viewProjectButtons[1]);
      fireEvent.click(viewProjectButtons[2]);
      
      // All clicks should register and create navigation events
      viewProjectButtons.forEach((button) => {
        expect(button.closest('a')).toHaveAttribute('href', expect.stringMatching(/^\/portfolio\//));
      });
    });

    it('handles projects with missing data gracefully', () => {
      // Mock projects with missing data
      jest.spyOn(require('../portfolio/page'), 'projects').mockImplementation(() => [
        {
          title: 'Project with Missing Data',
          // Missing description
          // Missing tags
          // Missing imageUrl
        },
      ]);
      
      render(<Portfolio />);
      
      expect(screen.getByText('Project with Missing Data')).toBeInTheDocument();
      // Should not crash when data is missing
    });

    it('handles extremely long project titles and descriptions', () => {
      // Mock projects with long content
      jest.spyOn(require('../portfolio/page'), 'projects').mockImplementation(() => [
        {
          title: 'A'.repeat(100),
          description: 'B'.repeat(1000),
          tags: ['Long Tag '.repeat(10)],
          href: '/portfolio/long',
          imageUrl: '/test.jpg',
        },
      ]);
      
      render(<Portfolio />);
      
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
      expect(screen.getByText('B'.repeat(1000))).toBeInTheDocument();
    });

    it('handles concurrent loading of multiple project images', async () => {
      render(<Portfolio />);
      
      const images = screen.getAllByRole('img');
      
      // Simulate concurrent image loading
      const loadPromises = images.map((img) => {
        return new Promise((resolve) => {
          fireEvent.load(img);
          resolve(true);
        });
      });
      
      await Promise.all(loadPromises);
      
      // All images should be present
      expect(images).toHaveLength(4); // Assuming 4 projects
    });

    it('maintains layout integrity with varying content lengths', () => {
      // Mock projects with varying content lengths
      jest.spyOn(require('../portfolio/page'), 'projects').mockImplementation(() => [
        {
          title: 'Short',
          description: 'Brief.',
          tags: ['One'],
          href: '/1',
        },
        {
          title: 'Very Long Title That Should Not Break Layout',
          description: 'A'.repeat(500),
          tags: Array(10).fill('Tag'),
          href: '/2',
        },
      ]);
      
      const { container } = render(<Portfolio />);
      
      // Grid should maintain structure
      expect(container.querySelector('.grid')).toHaveClass('gap-8');
    });

    it('handles rapid filter/sort interactions', () => {
      render(<Portfolio />);
      
      // Simulate rapid tag clicks (if implemented)
      const tags = screen.getAllByTestId('tag');
      tags.forEach((tag) => {
        fireEvent.click(tag);
        fireEvent.click(tag); // Double click
      });
      
      // Layout should remain stable
      expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
    });

    it('maintains accessibility during dynamic content updates', () => {
      render(<Portfolio />);
      
      // Check focus management
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
      
      // Check ARIA attributes remain consistent
      const cards = screen.getAllByTestId('project-card');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('role', 'article');
      });
    });

    it('handles browser back/forward navigation', () => {
      render(<Portfolio />);
      
      const startProjectButton = screen.getByText('Start Your Project');
      fireEvent.click(startProjectButton);
      
      // Simulate browser back
      window.history.back();
      
      // Simulate browser forward
      window.history.forward();
      
      // Component should remain stable
      expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
    });
  });
}); 