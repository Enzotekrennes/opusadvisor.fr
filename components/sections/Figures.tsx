import React from 'react';
import styles from './inner.module.css';

/** A row of figures, each with what it measures and its source, in one panel. */
export const Figures: React.FC<{ items: { figure: string; text: string; source: string }[] }> = ({ items }) => (
  <dl className={styles.figures} data-reveal data-reveal-delay="1">
    {items.map((item) => (
      <div key={item.figure} className={styles.figure}>
        <dt>{item.figure}</dt>
        <dd>{item.text}</dd>
        <dd>Source&#8239;: {item.source}</dd>
      </div>
    ))}
  </dl>
);
