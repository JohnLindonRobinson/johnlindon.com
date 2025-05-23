import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';
import Link from 'next/link';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-accent', 'text-white');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-background', 'text-accent', 'border-accent');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('bg-transparent', 'text-accent', 'border-accent');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders as a link when asChild is used with Link', () => {
    render(
      <Button asChild>
        <Link href="/test">Click me</Link>
      </Button>
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('shows loading state when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('forwards additional HTML button attributes', () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('disables button when isLoading is true and prevents clicks', () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Loading' });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading...</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('pointer-events-none');
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
