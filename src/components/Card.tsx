'use client';

import Link from 'next/link';
import styles from './Card.module.css';

interface CardProps {
  href: string;
  title: string;
  description: string;
}

export function Card({ href, title, description }: CardProps) {
  return (
    <Link href={href} className={styles.cardContainer}>
      <div className={styles.card}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
