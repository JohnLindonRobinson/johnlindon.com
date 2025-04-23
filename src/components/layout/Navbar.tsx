"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
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
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const pointAControls = useAnimation();
  const pointBControls = useAnimation();
  const opacityControls = useAnimation();
  const [positions, setPositions] = useState<{ [key: string]: { left: number; width: number } }>({});
  const isAnimating = useRef(false);

  // Calculate and store positions of all nav items
  useEffect(() => {
    const updatePositions = () => {
      const newPositions: { [key: string]: { left: number; width: number } } = {};
      const navElement = navRef.current;
      if (navElement) {
        const links = navElement.getElementsByTagName('a');
        Array.from(links).forEach(link => {
          const rect = link.getBoundingClientRect();
          const navRect = navElement.getBoundingClientRect();
          newPositions[link.getAttribute('href') || ''] = {
            left: rect.left - navRect.left,
            width: rect.width
          };
        });
      }
      setPositions(newPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const animateIndicator = async (fromHref: string, toHref: string) => {
    if (isAnimating.current || !positions[fromHref] || !positions[toHref]) return;
    isAnimating.current = true;

    const from = positions[fromHref];
    const to = positions[toHref];
    const distance = Math.abs(to.left - from.left);
    const duration = Math.min(0.3 + (distance / 1000), 0.5);

    try {
      // Fade in
      await opacityControls.start({
        opacity: 1,
        transition: { duration: 0.2 }
      });

      // Point A starts at the left edge of current word and shrinks to dot
      await pointAControls.start({
        left: from.left - (from.width / 2),
        width: "6px",
        transition: { duration: duration / 3, ease: "easeInOut" }
      });

      // Point B shrinks to dot at its current position
      await pointBControls.start({
        width: "6px",
        transition: { duration: duration / 3, ease: "easeInOut" }
      });

      // Point A moves to new position
      await pointAControls.start({
        left: to.left - (to.width / 2),
        transition: { duration: duration / 3, ease: "easeInOut" }
      });

      // Point B moves to join Point A
      await pointBControls.start({
        left: to.left - (to.width / 2) + 6,
        transition: { duration: duration / 3, ease: "easeInOut" }
      });

      // Expand from Point A to Point B
      await Promise.all([
        pointAControls.start({
          width: "6px",
          transition: { duration: 0.2, ease: "easeOut" }
        }),
        pointBControls.start({
          left: to.left - (to.width / 2),
          width: to.width,
          transition: { duration: 0.2, ease: "easeOut" }
        })
      ]);
    } catch (error) {
      console.log('Animation interrupted');
    }

    isAnimating.current = false;
  };

  const handleMouseEnter = (href: string) => {
    if (href !== hoveredLink) {
      const fromHref = hoveredLink || href;
      setHoveredLink(href);
      animateIndicator(fromHref, href);
    }
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
    opacityControls.start({
      opacity: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    });
  };

  // Initialize the indicator position with 0 opacity
  useEffect(() => {
    if (positions[pathname]) {
      const width = positions[pathname].width;
      opacityControls.set({ opacity: 0 });
      pointAControls.set({
        left: positions[pathname].left - (width / 2),
        width: "6px"
      });
      pointBControls.set({
        left: positions[pathname].left - (width / 2),
        width: positions[pathname].width
      });
    }
  }, [positions, pathname, pointAControls, pointBControls, opacityControls]);

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
          ref={navRef}
          onMouseLeave={handleMouseLeave}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-manrope font-semibold text-2xl tracking-tighter transition-colors py-2",
                link.href === pathname ? "text-black" : "text-black/80 hover:text-primary"
              )}
              onMouseEnter={() => handleMouseEnter(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <motion.div
            animate={opacityControls}
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
          >
            <motion.div
              key="pointA"
              className="absolute bottom-0 h-[6px] bg-[#7a2eff] rounded-full"
              initial={false}
              animate={pointAControls}
            />
            <motion.div
              key="pointB"
              className="absolute bottom-0 h-[6px] bg-[#7a2eff] rounded-full"
              initial={false}
              animate={pointBControls}
            />
          </motion.div>
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
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-manrope font-semibold transition-colors",
                  link.href === pathname
                    ? "text-black"
                    : "text-black/80 hover:text-primary"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 