'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Footer from "./layout/Footer";
import { Navbar } from "./layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <header className="bg-white border-b border-primary/10">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              John Robinson
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-text/80 hover:text-accent transition-colors ${
                    pathname === item.href ? 'text-accent font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text/80 hover:text-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              data-testid="mobile-menu"
              className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden"
            >
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-text/80 hover:text-accent transition-colors ${
                    pathname === item.href ? 'text-accent font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
