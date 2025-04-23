'use client';

import Link from 'next/link';
import styles from './Card.module.css';
import { ReactNode } from 'react';

interface CardProps {
  href: string;
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  children?: ReactNode;
}

export function Card({ href, title, description, tags, imageUrl, children }: CardProps) {
  return (
    <Link href={href} className={styles.cardContainer}>
      <div className={styles.card}>
        {imageUrl && (
          <div className="mb-4">
            <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </Link>
  );
}

export default Card;
