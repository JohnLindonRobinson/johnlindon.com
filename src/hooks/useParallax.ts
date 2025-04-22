'use client';

import { useEffect, useState } from 'react';

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffset(window.scrollY * speed);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, isMounted]);

  if (!isMounted) return 0;
  return offset;
} 