import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import HomeHero from '../HomeHero';

describe('HomeHero', () => {
  it('renders hero section with correct content', () => {
    render(<HomeHero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('John Robinson');
    expect(screen.getByText('Freelance Developer & Systems Consultant')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my portfolio/)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<HomeHero />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass(
      'min-h-[80vh]',
      'flex',
      'items-center',
      'justify-center',
      'bg-gradient-to-br',
      'from-gray-900',
      'to-gray-800'
    );

    const contentContainer = container.querySelector('div');
    expect(contentContainer).toHaveClass(
      'max-w-4xl',
      'mx-auto',
      'text-center'
    );
  });

  it('has accessible heading structure', () => {
    render(<HomeHero />);
    
    // Check heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('text-4xl', 'font-bold', 'mb-6');
    
    // Check subtitle styling
    const subtitle = screen.getByText('Freelance Developer & Systems Consultant');
    expect(subtitle).toHaveClass('text-xl', 'mb-4');
  });

  it('renders with proper semantic HTML structure', () => {
    const { container } = render(<HomeHero />);
    
    // Check for semantic section tag
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Check for proper content structure
    expect(container.querySelector('.prose')).toBeInTheDocument();
    expect(container.querySelector('.prose-lg')).toBeInTheDocument();
  });
}); 