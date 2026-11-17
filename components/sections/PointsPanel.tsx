import React from 'react';
import { Section, SectionHead } from './Section';
import styles from './inner.module.css';

/**
 * A section listing short points (title and one or two sentences) in one panel, two columns wide on
 * large screens: the pains of a trade, the criteria of a programme.
 */
export const PointsPanel: React.FC<{
  id: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  items: { title: string; desc: string }[];
  tone?: 'ground' | 'white';
}> = ({ id, title, lede, items, tone }) => (
  <Section tone={tone} labelledBy={id}>
    <SectionHead id={id} title={title} lede={lede} />
    <ul className={`${styles.panel} ${styles.panelTwo}`} data-reveal data-reveal-delay="1">
      {items.map((item) => (
        <li key={item.title} className={styles.panelItem}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </li>
      ))}
    </ul>
  </Section>
);
