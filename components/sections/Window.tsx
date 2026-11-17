import React from 'react';
import styles from './sections.module.css';

/**
 * A light application window, the frame of the home page sections below the desktop hero: a title bar
 * with the three window buttons in red, yellow and green, as on the home desktop, and an optional title.
 *
 * A plain `div`: the site styles every `article` as a blog post.
 *
 * @param title text shown in the title bar, decorative: the content carries its own heading.
 */
export const Window: React.FC<{ title?: string; className?: string; children: React.ReactNode }> = ({
  title,
  className = '',
  children,
}) => (
  <div className={`${styles.window} ${className}`}>
    <div className={styles.windowBar} aria-hidden="true">
      <i />
      <i />
      <i />
      {title && <span className={styles.windowTitle}>{title}</span>}
    </div>
    {children}
  </div>
);
