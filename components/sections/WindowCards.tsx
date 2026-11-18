import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Window } from './Window';
import { frenchSpacing } from '@/lib/typo';
import styles from './sections.module.css';

/** One card: a small label on top, a title, a sentence, an optional pill, an optional link. */
export interface WindowCard {
  key: string;
  label: string;
  title: string;
  text: string;
  pill?: string;
  href?: string;
}

/**
 * Cards side by side, each in a window: missions on the home page, typical systems on the BTP page.
 * A card with `href` is a link as a whole, with an arrow; one without is a plain card. Three columns on
 * large screens, or two for two or four cards, so none is left alone on a row.
 */
export const WindowCards: React.FC<{ items: WindowCard[] }> = ({ items }) => (
  <ul className={`${styles.cases} ${items.length === 2 || items.length === 4 ? styles.casesTwo : ''}`}>
    {items.map((item, i) => {
      const body = (
        <Window>
          <div className={styles.caseBody}>
            <p className={styles.caseClient}>{item.label}</p>
            <h3 className={styles.caseTitle}>{frenchSpacing(item.title)}</h3>
            <p className={styles.caseSummary}>{frenchSpacing(item.text)}</p>
            {(item.pill || item.href) && (
              <div className={styles.caseFoot}>
                {item.pill ? <span className={styles.pill}>{item.pill}</span> : <span />}
                {item.href && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
              </div>
            )}
          </div>
        </Window>
      );
      return (
        <li key={item.key} data-reveal data-reveal-delay={String(i + 1)}>
          {item.href ? (
            <Link href={item.href} className={styles.caseLink}>
              {body}
            </Link>
          ) : (
            <div className={styles.caseStatic}>{body}</div>
          )}
        </li>
      );
    })}
  </ul>
);
