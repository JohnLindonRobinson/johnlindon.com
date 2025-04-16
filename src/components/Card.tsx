'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
  title: string
  description: string
  imageUrl?: string
  tags?: string[]
  href?: string
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({
  title,
  description,
  imageUrl,
  tags = [],
  href,
  children,
  className = '',
  onClick
}: CardProps) {
  const cardContent = (
    <div
      className={`bg-white rounded-lg shadow-sm border border-primary/10 overflow-hidden transition-transform hover:scale-[1.02] ${className}`}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
        <p className="text-text/80 mb-4">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-90 transition-opacity">
        {cardContent}
      </Link>
    )
  }

  return cardContent
} 