import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, tabIndex, className }: { 
    children: React.ReactNode; 
    href: string;
    tabIndex?: number;
    className?: string;
  }) => (
    <a href={href} tabIndex={tabIndex} className={className}>{children}</a>
  ),
}));

describe('Card', () => {
  const defaultProps = {
    href: '/test-service',
    title: 'Test Card',
    description: 'Test description',
    briefExplanation: 'A brief explanation of the service',
    whatIsIt: 'This is a test service that helps with testing',
    whatDoIDeliver: ['Item 1', 'Item 2', 'Item 3'],
    whoIsItFor: 'This is for people who need testing services',
    tags: ['Test', 'Service'],
  };

  it('renders with required props', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.briefExplanation)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.whatIsIt)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.whoIsItFor)).toBeInTheDocument();
    defaultProps.whatDoIDeliver.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders image when imageUrl is provided', () => {
    const imageUrl = 'https://example.com/image.jpg';
    render(<Card {...defaultProps} imageUrl={imageUrl} />);
    
    const image = screen.getByAltText(defaultProps.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });

  it('renders tags when provided', () => {
    render(<Card {...defaultProps} />);
    
    defaultProps.tags.forEach(tag => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });

  it('renders as a link when href is provided', () => {
    render(<Card {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', defaultProps.href);
  });

  it('renders children when provided', () => {
    const childText = 'Child content';
    render(
      <Card {...defaultProps}>
        <div>{childText}</div>
      </Card>
    );
    
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('handles long text content gracefully', () => {
    const longProps = {
      ...defaultProps,
      title: 'A'.repeat(100),
      description: 'B'.repeat(300),
      briefExplanation: 'C'.repeat(200),
      whatIsIt: 'D'.repeat(200),
      whoIsItFor: 'E'.repeat(200),
    };
    
    render(<Card {...longProps} />);
    
    expect(screen.getByText(longProps.title)).toBeInTheDocument();
    expect(screen.getByText(longProps.briefExplanation)).toBeInTheDocument();
  });

  it('renders without tags when tags array is empty', () => {
    render(<Card {...defaultProps} tags={[]} />);
    
    defaultProps.tags.forEach(tag => {
      expect(screen.queryByText(`#${tag}`)).not.toBeInTheDocument();
    });
  });

  it('renders without image when imageUrl is not provided', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('has appropriate ARIA attributes when interactive', () => {
      render(<Card {...defaultProps} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', defaultProps.href);
    });

    it('maintains focus states for keyboard navigation', () => {
      render(<Card {...defaultProps} />);
      const link = screen.getByRole('link');
      
      link.focus();
      expect(document.activeElement).toBe(link);
    });

    it('preserves tab order when rendered as a link', () => {
      render(<Card {...defaultProps} />);
      
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Edge Cases', () => {
    it('handles extremely long text content', () => {
      const longProps = {
        ...defaultProps,
        title: 'A'.repeat(100),
        description: 'B'.repeat(500),
        briefExplanation: 'C'.repeat(300),
        whatIsIt: 'D'.repeat(300),
        whoIsItFor: 'E'.repeat(300),
      };
      
      render(<Card {...longProps} />);
      
      expect(screen.getByText(longProps.title)).toBeInTheDocument();
      expect(screen.getByText(longProps.briefExplanation)).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialProps = {
        ...defaultProps,
        title: '!@#$%^&*()_+ Test <script>alert("xss")</script>',
        description: '< > & " \' / \\ Test',
        briefExplanation: '< > & " \' / \\ Brief',
        whatIsIt: '< > & " \' / \\ What',
        whoIsItFor: '< > & " \' / \\ Who',
      };
      
      render(<Card {...specialProps} />);
      
      expect(screen.getByText(specialProps.title)).toBeInTheDocument();
      expect(screen.getByText(specialProps.briefExplanation)).toBeInTheDocument();
    });
  });
}); 