import React from 'react';
import Link from 'next/link';
import styles from './inner.module.css';

/**
 * A grid of link cards (title and one line), for articles to read or free tools.
 *
 * @param three three columns on large screens instead of two.
 */
export const LinkCards: React.FC<{ items: { href: string; title: string; text: string }[]; three?: boolean }> = ({ items, three }) => (
  <ul className={`${styles.links} ${three ? styles.linksThree : ''}`}>
    {items.map((item, i) => (
      <li key={item.href} data-reveal data-reveal-delay={String((i % 3) + 1)}>
        <Link href={item.href} className={styles.linkCard}>
          <b>{item.title}</b>
          <span>{item.text}</span>
        </Link>
      </li>
    ))}
  </ul>
);
