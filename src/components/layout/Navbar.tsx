"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  // Reset transition state after animation
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleMouseEnter = (href: string) => {
    if (href !== hoveredLink) {
      setIsTransitioning(true);
      setHoveredLink(href);
    }
  };

  const handleMouseLeave = () => {
    setIsTransitioning(true);
    setHoveredLink(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <span className="font-manrope font-extrabold text-4xl tracking-tighter">
              John Lindon
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-primary" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div 
          className="hidden md:flex items-center space-x-8 relative"
          onMouseLeave={handleMouseLeave}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-manrope font-semibold text-2xl tracking-tighter transition-colors py-2 px-2",
                link.href === pathname ? "text-black" : "text-black/80 hover:text-primary"
              )}
              onMouseEnter={() => handleMouseEnter(link.href)}
            >
              {link.label}
              {(hoveredLink === link.href || (!hoveredLink && link.href === pathname)) && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#7a2eff] rounded-full"
                  animate={{
                    width: isTransitioning ? "6px" : "100%",
                    x: isTransitioning ? "50%" : "0%",
                    left: isTransitioning ? "-3px" : "0"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    width: {
                      duration: 0.15
                    }
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden"
            >
              <div className="py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2 text-lg font-medium transition-colors",
                      link.href === pathname ? "text-primary" : "text-gray-600 hover:text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 