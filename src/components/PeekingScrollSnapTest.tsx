'use client';

import React, { useRef, useEffect, useState } from 'react';

const cards = [
  { title: 'Card 1', color: 'bg-red-200' },
  { title: 'Card 2', color: 'bg-green-200' },
  { title: 'Card 3', color: 'bg-blue-200' },
];

export default function PeekingScrollSnapTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // IntersectionObserver for scaling/fading
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
        if (mostVisibleIdx !== activeIdx) {
          setActiveIdx(mostVisibleIdx);
        }
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    cardsEls.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [activeIdx]);

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
      if (e.deltaY > 0 && activeIdx < cards.length - 1) {
        nextIdx = activeIdx + 1;
      } else if (e.deltaY < 0 && activeIdx > 0) {
        nextIdx = activeIdx - 1;
      }

      // Only scroll if the index is changing
      if (nextIdx !== activeIdx) {
        scrollToCard(nextIdx);
      }

      setTimeout(() => {
        isScrolling = false;
      }, 500); // Prevent rapid fire
    };

    const scrollToCard = (idx: number) => {
      const card = container.querySelectorAll('.peek-card')[idx] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeIdx]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] pt-16 px-4">
      <div
        ref={containerRef}
        className="flex flex-col overflow-y-auto snap-y snap-mandatory py-8 space-y-8 scroll-smooth"
        style={{ scrollPadding: '25vh 0' }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`peek-card snap-center w-[60vw] h-[60vh] mx-auto flex items-center justify-center transition-all duration-300
              ${card.color}
              ${activeIdx === idx ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}
            `}
            style={{ borderRadius: '2rem' }}
          >
            <h2 className="text-4xl">{card.title}</h2>
          </div>
        ))}
      </div>
    </section>
  );
} 