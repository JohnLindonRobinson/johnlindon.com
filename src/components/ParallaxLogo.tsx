'use client';

import { useParallax } from "@/hooks/useParallax";

export function ParallaxLogo() {
  // Speed of 0.4 means logo moves at 60% of scroll speed (40% slower)
  const parallaxOffset = useParallax(0.4);
  
  return (
    <div className="absolute inset-y-0 -right-1/2 left-1/4 flex items-center justify-end overflow-visible z-0">
      <img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        style={{
          transform: `translate3d(33.33%, ${-50 + parallaxOffset * 0.6}px, 0) rotate(25deg)`,
          willChange: 'transform'
        }}
        className="w-[560vw] max-w-none opacity-25 blur-sm transform-gpu"
      />
    </div>
  );
} 