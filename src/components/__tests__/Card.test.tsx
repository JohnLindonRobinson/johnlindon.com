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
    title: 'Test Card',
    description: 'Test description',
  };

  it('renders with required props', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    const imageUrl = 'https://example.com/image.jpg';
    render(<Card {...defaultProps} imageUrl={imageUrl} />);
    
    const image = screen.getByAltText(defaultProps.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });

  it('renders tags when provided', () => {
    const tags = ['React', 'TypeScript'];
    render(<Card {...defaultProps} tags={tags} />);
    
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders as a link when href is provided', () => {
    const href = '/test-link';
    render(<Card {...defaultProps} href={href} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', href);
  });

  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    render(<Card {...defaultProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(onClick).toHaveBeenCalledTimes(1);
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

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<Card {...defaultProps} className={customClass} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass(customClass);
  });

  it('handles long text content gracefully', () => {
    const longTitle = 'A'.repeat(100);
    const longDescription = 'B'.repeat(300);
    
    render(<Card title={longTitle} description={longDescription} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('renders without tags when tags array is empty', () => {
    render(<Card {...defaultProps} tags={[]} />);
    
    const card = screen.getByText(defaultProps.title).closest('div');
    expect(card?.querySelector('.gap-2')).not.toBeInTheDocument();
  });

  it('renders without image when imageUrl is not provided', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('has appropriate ARIA attributes when interactive', () => {
      const onClick = vi.fn();
      render(<Card {...defaultProps} onClick={onClick} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabindex', '0');
      expect(card).toHaveAttribute('aria-label', defaultProps.title);
    });

    it('handles keyboard interaction correctly', () => {
      const onClick = vi.fn();
      render(<Card {...defaultProps} onClick={onClick} />);
      
      const card = screen.getByRole('article');
      card.focus();
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('maintains focus states for keyboard navigation', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByRole('article');
      
      card.focus();
      expect(document.activeElement).toBe(card);
    });

    it('preserves tab order when rendered as a link', () => {
      const href = '/test-link';
      render(<Card {...defaultProps} href={href} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '0');
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Edge Cases', () => {
    it('handles extremely long text content', () => {
      const longProps = {
        title: 'A'.repeat(100),
        description: 'B'.repeat(500),
      };
      
      render(<Card {...longProps} />);
      
      expect(screen.getByText(longProps.title)).toBeInTheDocument();
      expect(screen.getByText(longProps.description)).toBeInTheDocument();
      expect(screen.getByRole('article')).toHaveClass('overflow-hidden');
    });

    it('handles nested interactive elements correctly', () => {
      const cardClick = vi.fn();
      const buttonClick = vi.fn();
      
      render(
        <Card {...defaultProps} onClick={cardClick}>
          <button onClick={buttonClick}>Nested Button</button>
        </Card>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(buttonClick).toHaveBeenCalledTimes(1);
      expect(cardClick).not.toHaveBeenCalled();
    });

    it('handles special characters in content', () => {
      const specialProps = {
        title: '!@#$%^&*()_+ Test <script>alert("xss")</script>',
        description: '< > & " \' / \\ Test',
      };
      
      render(<Card {...specialProps} />);
      
      expect(screen.getByText(specialProps.title)).toBeInTheDocument();
      expect(screen.getByText(specialProps.description)).toBeInTheDocument();
    });
  });
}); 