'use client';

import Link from 'next/link';
import { ReactNode, KeyboardEvent, MouseEvent } from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  href?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  description,
  imageUrl,
  tags = [],
  href,
  children,
  className = '',
  onClick,
}: CardProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const handleClick = (e: MouseEvent) => {
    // Only trigger onClick if the click wasn't on an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.tagName.toLowerCase() === 'button' || 
                         target.tagName.toLowerCase() === 'a' ||
                         target.tagName.toLowerCase() === 'input' ||
                         target.tagName.toLowerCase() === 'select' ||
                         target.tagName.toLowerCase() === 'textarea';
    
    if (onClick && !isInteractive) {
      onClick();
    }
  };

  const cardContent = (
    <div
      role="article"
      tabIndex={0}
      aria-label={title}
      className={`bg-white rounded-lg shadow-sm border border-primary/10 overflow-hidden transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`.trim()}
      onClick={handleClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {imageUrl && (
        <div className="relative h-48 w-full">
          <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2 overflow-hidden text-ellipsis">{title}</h3>
        <p className="text-text/80 mb-4 overflow-hidden text-ellipsis">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50"
        tabIndex={0}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
