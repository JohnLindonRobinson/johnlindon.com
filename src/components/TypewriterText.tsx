'use client';

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const technologies = [
  "#React",
  "#TypeScript",
  "#Next.js",
  "#TailwindCSS",
  "#Node.js",
  "#AWS"
];

export function TypewriterText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLSpanElement>(null);
  
  // Calculate the width of the widest technology name
  useEffect(() => {
    if (containerRef.current) {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.fontSize = window.getComputedStyle(containerRef.current).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(containerRef.current).fontFamily;
      document.body.appendChild(tempSpan);

      // Find the widest text
      let maxWidth = 0;
      technologies.forEach(tech => {
        tempSpan.textContent = tech;
        maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
      });

      // Set the width
      containerRef.current.style.width = `${maxWidth + 4}px`; // Add space for cursor
      document.body.removeChild(tempSpan);
    }
  }, []);

  useEffect(() => {
    const typingSpeed = 100; // Speed for typing
    const deletingSpeed = 50; // Speed for deleting
    const pauseDuration = 2000; // How long to pause at full word
    
    const typeText = () => {
      const currentTech = technologies[currentIndex];
      
      if (!isDeleting) {
        // Typing
        if (text !== currentTech) {
          setText(currentTech.slice(0, text.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (text) {
          setText(currentTech.slice(0, text.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentIndex((current) => (current + 1) % technologies.length);
        }
      }
    };

    const timeout = setTimeout(
      typeText,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentIndex]);

  return (
    <span className="inline-flex h-[1.5em] items-center">
      <span
        ref={containerRef}
        className="inline-flex items-center text-primary"
        style={{
          height: '1.5em',
          lineHeight: '1.5em',
        }}
      >
        <span className="whitespace-pre">{text}</span>
        <span 
          className="inline-block w-[2px] h-[1.2em] bg-primary ml-[1px] translate-y-[1px]"
          style={{
            animation: 'blink 1s steps(1) infinite'
          }}
        />
      </span>
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
} 