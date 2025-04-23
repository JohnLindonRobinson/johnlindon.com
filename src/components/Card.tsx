'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Card.module.css';
import { ReactNode } from 'react';

interface CardProps {
  href: string;
  title: string;
  description: string;
  briefExplanation: string;
  whatIsIt: string;
  whatDoIDeliver: string[];
  whoIsItFor: string;
  tags: string[];
  imageUrl?: string;
  children?: ReactNode;
  isActive?: boolean;
}

const Card = ({ 
  href, 
  title, 
  description,
  briefExplanation,
  whatIsIt,
  whatDoIDeliver,
  whoIsItFor,
  tags, 
  imageUrl, 
  children,
  isActive = false 
}: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: isActive ? 1 : 0.6 }}
      animate={{ opacity: isActive ? 1 : 0.6 }}
      transition={{ duration: 0.3 }}
      className={styles.cardContainer}
    >
      <Link href={href} className={styles.cardLink}>
        <div className={`${styles.card} ${isActive ? styles.activeCard : ''}`}>
          <div className={styles.cardSidebar}>
            {imageUrl && (
              <div className={styles.imageContainer}>
                <img src={imageUrl} alt={title} className={styles.image} />
              </div>
            )}
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.briefExplanation}>{briefExplanation}</p>
            
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>What is it?</h4>
              <p className={styles.sectionText}>{whatIsIt}</p>
            </div>
            
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>What do I Deliver?</h4>
              <ul className={styles.deliverablesList}>
                {whatDoIDeliver.map((item, index) => (
                  <li key={index} className={styles.deliverablesItem}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Who is it for?</h4>
              <p className={styles.sectionText}>{whoIsItFor}</p>
            </div>

            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>#{tag}</span>
              ))}
            </div>

            <motion.button 
              className={styles.enquiryButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add To Enquiry
            </motion.button>
            {children}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
