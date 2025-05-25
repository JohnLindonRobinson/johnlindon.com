'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface Service {
  id: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
  tags?: string[];
  slug?: string;
  details?: string;
  deliverables?: string[];
  idealClient?: string;
  cta?: string;
  // Add other fields as needed (e.g., image, icon, etc.)
}

interface PeekingScrollSnapProps {
  services: Service[];
  activeIdx?: number;
  onActiveIdxChange?: (idx: number) => void;
}

export default function PeekingScrollSnap({
  services,
  activeIdx: controlledIdx,
  onActiveIdxChange,
}: PeekingScrollSnapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalIdx, setInternalIdx] = useState(0);
  const activeIdx = controlledIdx ?? internalIdx;
  const lastIdxRef = useRef<number>(activeIdx);

  // IntersectionObserver for scaling/fading and parent sync
  useEffect(() => {
    const cardsEls = containerRef.current?.querySelectorAll('.peek-card');
    if (!cardsEls) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisibleIdx = activeIdx;
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleIdx = idx;
          }
        });
        if (mostVisibleIdx !== lastIdxRef.current) {
          lastIdxRef.current = mostVisibleIdx;
          if (onActiveIdxChange) {
            onActiveIdxChange(mostVisibleIdx);
          } else {
            setInternalIdx(mostVisibleIdx);
          }
        }
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    cardsEls.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [activeIdx, onActiveIdxChange]);

  // Wheel event for paged scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      isScrolling = true;

      let nextIdx = activeIdx;
      if (e.deltaY > 0 && activeIdx < services.length - 1) {
        nextIdx = activeIdx + 1;
      } else if (e.deltaY < 0 && activeIdx > 0) {
        nextIdx = activeIdx - 1;
      }

      if (nextIdx !== activeIdx) {
        scrollToCard(nextIdx);
        if (onActiveIdxChange) {
          onActiveIdxChange(nextIdx);
        } else {
          setInternalIdx(nextIdx);
        }
      }

      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    const scrollToCard = (idx: number) => {
      const card = container.querySelectorAll('.peek-card')[idx] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeIdx, services.length, onActiveIdxChange]);

  // Scroll to card if controlledIdx changes (but only if it actually changed)
  useEffect(() => {
    if (controlledIdx === undefined) return;
    if (lastIdxRef.current === controlledIdx) return;
    lastIdxRef.current = controlledIdx;
    const container = containerRef.current;
    if (!container) return;
    const card = container.querySelectorAll('.peek-card')[controlledIdx] as HTMLElement;
    card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [controlledIdx]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] pt-16 px-4">
      <div
        ref={containerRef}
        className="flex flex-col overflow-y-auto snap-y snap-mandatory py-8 space-y-8 scroll-smooth"
        style={{ scrollPadding: '25vh 0' }}
      >
        {services.map((service, idx) => (
          <div
            key={service.id}
            data-idx={idx}
            className={`peek-card snap-center w-[60vw] h-[60vh] mx-auto flex items-center justify-center transition-all duration-300
              bg-white shadow-lg
              ${activeIdx === idx ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}
            `}
            style={{ borderRadius: '2rem' }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">{service.title}</h2>
              <p className="text-lg">{service.description}</p>
              {/* Add image/icon/etc. here if needed */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 