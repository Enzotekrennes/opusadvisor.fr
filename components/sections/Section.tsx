import React from 'react';
import styles from './sections.module.css';

/**
 * Frame of a daylight section: the cool grey or white ground, the shared padding and the content width.
 *
 * @param tone `ground` (cool grey) or `white`; consecutive sections alternate.
 * @param labelledBy id of the section's heading.
 * @param narrow narrower content column, for a list of questions or a single card.
 */
export const Section: React.FC<{
  id?: string;
  tone?: 'ground' | 'white';
  labelledBy?: string;
  narrow?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ id, tone = 'white', labelledBy, narrow, className = '', children }) => (
  <section
    id={id}
    className={`${styles.section} ${tone === 'ground' ? styles.ground : styles.white} ${id ? 'scroll-mt-20' : ''} ${className}`}
    aria-labelledby={labelledBy}
  >
    <div className={narrow ? styles.narrow : styles.inner}>{children}</div>
  </section>
);

/**
 * Heading block of a section: an h2 and an optional lede, revealed on scroll.
 *
 * @param centered centre the block (sections whose content is a centred grid).
 */
export const SectionHead: React.FC<{ id: string; title: React.ReactNode; lede?: React.ReactNode; centered?: boolean }> = ({
  id,
  title,
  lede,
  centered,
}) => (
  <div className={`${styles.head} ${centered ? styles.centered : ''}`} data-reveal>
    <h2 id={id} className={styles.title}>
      {title}
    </h2>
    {lede && <p className={styles.lede}>{lede}</p>}
  </div>
);
