import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/lib/cases';
import { Window } from './Window';
import styles from './sections.module.css';

/**
 * Home page: the three real missions, unnamed, as three windows, each opening its full story on the
 * Cases page. Right under the desktop hero, it answers its last link ("Voir ce qu'on a déjà mis en place").
 */
export const HomeCases: React.FC = () => (
  <section className={`${styles.section} ${styles.ground}`} aria-labelledby="cases-title">
    <div className={styles.inner}>
      <div className={`${styles.head} ${styles.centered}`} data-reveal>
        <h2 id="cases-title" className={styles.title}>
          Ce qu’on a déjà mis en place.
        </h2>
        <p className={styles.lede}>Trois missions récentes, présentées sans le nom des clients.</p>
      </div>

      <ul className={styles.cases}>
        {cases.map((c, i) => (
          <li key={c.slug} data-reveal data-reveal-delay={String(i + 1)}>
            <Link href={`/cas-clients/#${c.slug}`} className={styles.caseLink}>
              <Window>
                <div className={styles.caseBody}>
                  <p className={styles.caseClient}>{c.client}</p>
                  <h3 className={styles.caseTitle}>{c.title}</h3>
                  <p className={styles.caseSummary}>{c.summary}</p>
                  <div className={styles.caseFoot}>
                    <span className={styles.pill}>{c.level.charAt(0).toUpperCase() + c.level.slice(1)}</span>
                    <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>
              </Window>
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.below} data-reveal>
        <Link href="/cas-clients" className={styles.more}>
          Tous les cas clients
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </p>
    </div>
  </section>
);
