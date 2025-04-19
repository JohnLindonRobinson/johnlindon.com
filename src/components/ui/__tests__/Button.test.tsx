import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Click me</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Click me');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toContainElement(screen.getByRole('img', { hidden: true }));
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent');

    rerender(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-background');

    rerender(<Button variant="outline">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size="sm">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3');

    rerender(<Button size="md">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4');

    rerender(<Button size="lg">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6');
  });
});
