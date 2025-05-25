"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Utility: map mouse position to -1..1 range
function useMouseParallax(containerRef: React.RefObject<HTMLDivElement>) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMouse({ x, y });
    }
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [containerRef]);
  return mouse;
}

const fragmentConfigs = [
  // Wireframe Cards
  { type: "card", top: "top-10", left: "left-10", w: "w-32", rotate: "rotate-[-6deg]", opacity: 0.25, yParallax: 30, xParallax: 20, delay: 0 },
  { type: "card", top: "top-32", left: "left-1/2", w: "w-24", rotate: "rotate-[4deg]", opacity: 0.18, yParallax: 18, xParallax: 10, delay: 0.1 },
  // Notion-style Blocks
  { type: "notion", bottom: "bottom-24", left: "left-1/3", w: "w-24", rotate: "rotate-[5deg]", opacity: 0.22, yParallax: -24, xParallax: 12, delay: 0.2 },
  { type: "notion", bottom: "bottom-10", left: "left-1/4", w: "w-20", rotate: "rotate-[-3deg]", opacity: 0.13, yParallax: -16, xParallax: 8, delay: 0.3 },
  // Flowchart Nodes
  { type: "flow", top: "top-20", right: "right-20", w: "w-24", rotate: "rotate-[3deg]", opacity: 0.18, yParallax: 18, xParallax: 8, delay: 0.4 },
  // Code Snippet Blocks
  { type: "code", top: "top-1/2", left: "left-[5%]", w: "w-[160px]", rotate: "rotate-[-5deg]", opacity: 0.22, yParallax: 36, xParallax: 16, delay: 0.6 },
  { type: "code", top: "top-1/4", left: "left-1/3", w: "w-28", rotate: "rotate-[7deg]", opacity: 0.13, yParallax: 20, xParallax: 10, delay: 0.7 },
  // Stacked Boxes
  { type: "stack", bottom: "bottom-[10%]", right: "right-[5%]", w: "w-[100px]", rotate: "rotate-[8deg]", opacity: 0.18, yParallax: -28, xParallax: 6, delay: 0.8 },
  // Terminal Cursors
  { type: "term", top: "top-[75%]", left: "left-[55%]", w: "w-[60px]", opacity: 0.18, yParallax: 20, xParallax: 8, delay: 1.0 },
];

export const Fragments = () => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const mouse = useMouseParallax(containerRef);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {fragmentConfigs.map((cfg, i) => {
        // Parallax: deeper and unique per fragment for more depth
        const scrollDepth = 800 + i * 120; // Each fragment gets a slightly different scroll range
        const yScroll = useTransform(
          scrollY,
          [0, scrollDepth],
          [0, shouldReduceMotion ? 0 : cfg.yParallax]
        );
        // Mouse parallax: small offset, unique per fragment
        const xMouse = shouldReduceMotion ? 0 : mouse.x * (cfg.xParallax || 0);
        const yMouse = shouldReduceMotion ? 0 : mouse.y * (cfg.xParallax || 0);
        const style = {
          y: yScroll,
          x: xMouse,
          willChange: "transform",
        };
        const baseProps = {
          style,
          className: [
            "absolute",
            cfg.top,
            cfg.bottom,
            cfg.left,
            cfg.right,
            cfg.w,
            cfg.rotate,
          ].filter(Boolean).join(" ") + ` opacity-[${cfg.opacity}]`,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: cfg.opacity, y: 0 },
          transition: { duration: 0.7, delay: cfg.delay, ease: [0.33, 1, 0.68, 1] },
        };
        if (cfg.type === "card") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 120 80" fill="none">
              <rect width="120" height="80" rx="8" fill="#EEE6FB" />
              <rect x="12" y="14" width="96" height="10" rx="2" fill="#C8A9F0" />
              <rect x="12" y="32" width="72" height="8" rx="1.5" fill="#E0D1F5" />
              <rect x="12" y="48" width="52" height="8" rx="1.5" fill="#E0D1F5" />
            </motion.svg>
          );
        }
        if (cfg.type === "notion") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 100 70" fill="none">
              <rect width="100" height="70" rx="6" fill="#F8F3FF" />
              <circle cx="12" cy="16" r="3" fill="#B798F5" />
              <rect x="20" y="13" width="64" height="6" rx="2" fill="#E8DBFA" />
              <rect x="12" y="30" width="76" height="6" rx="2" fill="#E8DBFA" />
              <rect x="12" y="45" width="56" height="6" rx="2" fill="#E8DBFA" />
            </motion.svg>
          );
        }
        if (cfg.type === "flow") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 90 90" fill="none">
              <circle cx="45" cy="45" r="44" stroke="#EEE6FB" strokeWidth="2" />
              <circle cx="45" cy="25" r="5" fill="#B798F5" />
              <circle cx="25" cy="65" r="5" fill="#B798F5" />
              <circle cx="65" cy="65" r="5" fill="#B798F5" />
              <line x1="45" y1="25" x2="25" y2="65" stroke="#C8A9F0" strokeWidth="1.5" />
              <line x1="45" y1="25" x2="65" y2="65" stroke="#C8A9F0" strokeWidth="1.5" />
            </motion.svg>
          );
        }
        if (cfg.type === "code") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 160 80" fill="none">
              <rect width="160" height="80" rx="8" fill="#1F1B2E" />
              <circle cx="12" cy="12" r="3" fill="#F7768E" />
              <circle cx="22" cy="12" r="3" fill="#FAB387" />
              <circle cx="32" cy="12" r="3" fill="#A6E3A1" />
              <rect x="12" y="24" width="136" height="6" rx="2" fill="#CBA6F7" opacity="0.8" />
              <rect x="12" y="36" width="110" height="6" rx="2" fill="#D9E0EE" opacity="0.6" />
              <rect x="12" y="48" width="90" height="6" rx="2" fill="#D9E0EE" opacity="0.4" />
              <rect x="12" y="60" width="60" height="6" rx="2" fill="#D9E0EE" opacity="0.2" />
            </motion.svg>
          );
        }
        if (cfg.type === "stack") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="60" height="20" rx="4" fill="#EEE6FB" />
              <rect x="20" y="35" width="60" height="20" rx="4" fill="#E4D6F9" />
              <rect x="30" y="60" width="60" height="20" rx="4" fill="#D6C3F0" />
            </motion.svg>
          );
        }
        if (cfg.type === "term") {
          return (
            <motion.svg key={i} {...baseProps} viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="8" fill="#1F1B2E" />
              <text x="15" y="35" fill="#CBA6F7" fontSize="16" fontFamily="monospace">_</text>
            </motion.svg>
          );
        }
        return null;
      })}
    </div>
  );
}; 