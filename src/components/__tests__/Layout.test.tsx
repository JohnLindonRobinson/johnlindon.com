import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';

// Mock usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the current year for consistent snapshots
const mockDate = new Date('2024');
global.Date = jest.fn(() => mockDate) as any;
(global.Date as any).getFullYear = () => 2024;

describe('Layout Component', () => {
  const usePathname = jest.requireMock('next/navigation').usePathname;

  beforeEach(() => {
    usePathname.mockReturnValue('/');
  });

  it('renders header with logo and navigation', () => {
    render(<Layout>Content</Layout>);
    
    // Check logo (first occurrence in header)
    const logoLink = screen.getAllByText('John Robinson')[0];
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.tagName).toBe('A');
    expect(logoLink).toHaveClass('text-2xl', 'font-bold', 'text-primary');
    
    // Check navigation items
    const navItems = ['Home', 'Services', 'Portfolio', 'About', 'Contact'];
    navItems.forEach(item => {
      const links = screen.getAllByRole('link', { name: item });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', item === 'Home' ? '/' : `/${item.toLowerCase()}`);
    });
  });

  it('highlights active navigation item based on current path', () => {
    usePathname.mockReturnValue('/about');
    render(<Layout>Content</Layout>);
    
    const activeLinks = screen.getAllByRole('link', { name: 'About' });
    const activeDesktopLink = activeLinks[0];
    expect(activeDesktopLink).toHaveClass('text-accent');
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Layout>Content</Layout>);
    
    // Initially mobile menu should be hidden
    const menuButton = screen.getByRole('button', { name: '' }); // Button has no accessible name
    expect(menuButton).toHaveClass('md:hidden');
    
    // Initially mobile menu should not be in the DOM
    const mobileMenu = screen.queryByTestId('mobile-menu');
    expect(mobileMenu).not.toBeInTheDocument();
    
    // Click hamburger button
    fireEvent.click(menuButton);
    
    // Mobile menu should be in the DOM
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(menuButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes mobile menu when a link is clicked', () => {
    render(<Layout>Content</Layout>);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);
    
    // Mobile menu should be in the DOM
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    
    // Click a link in mobile menu
    const mobileLink = screen.getByRole('link', { name: 'About' });
    fireEvent.click(mobileLink);
    
    // Menu should be removed from the DOM
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('renders footer with correct sections and links', () => {
    render(<Layout>Content</Layout>);
    
    // Check footer sections
    expect(screen.getByText('Freelance Developer & Systems Consultant')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Connect' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    
    // Check social links
    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johnlindonrobinson');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/JohnLindonRobinson');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check email link
    const emailLink = screen.getByRole('link', { name: 'john@johnlindon.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:john@johnlindon.com');
    
    // Check copyright
    expect(screen.getByText('© 2024 John Robinson. All rights reserved.')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Layout>Test Content</Layout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct responsive classes', () => {
    render(<Layout>Content</Layout>);
    
    // Desktop navigation should be hidden on mobile
    const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:flex');
    expect(desktopNav).toBeInTheDocument();
    
    // Mobile menu button should be hidden on desktop
    const mobileMenuButton = screen.getByRole('button', { name: '' });
    expect(mobileMenuButton).toHaveClass('md:hidden');
  });
}); 