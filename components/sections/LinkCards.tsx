import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { frenchSpacing } from '@/lib/typo';
import styles from './inner.module.css';

/**
 * A grid of link cards (title, one line and an arrow), for articles to read or free tools. An odd last
 * card on two columns takes the whole row (inner.module.css).
 *
 * @param three three columns on large screens instead of two.
 */
export const LinkCards: React.FC<{ items: { href: string; title: string; text: string }[]; three?: boolean }> = ({ items, three }) => (
  <ul className={`${styles.links} ${three ? styles.linksThree : ''}`}>
    {items.map((item, i) => (
      <li key={item.href} data-reveal data-reveal-delay={String((i % 3) + 1)}>
        <Link href={item.href} className={styles.linkCard}>
          <b>{frenchSpacing(item.title)}</b>
          <span>{frenchSpacing(item.text)}</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </li>
    ))}
  </ul>
);
