import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './sections.module.css';

/**
 * Home page: the e-invoicing deadline for SMEs, as a calendar event. One sentence of context, a link to
 * the article on the reform, and the free two-minute diagnostic.
 */
export const HomeDeadline: React.FC = () => (
  <section className={`${styles.section} ${styles.ground}`} aria-labelledby="why-now-title">
    <div className={styles.narrow}>
      <div className={styles.event} data-reveal>
        <p className={styles.calendar} aria-hidden="true">
          <span className={styles.calendarMonth}>Sept.</span>
          <span className={styles.calendarDay}>1</span>
          <span className={styles.calendarYear}>2027</span>
        </p>
        <div>
          <h2 id="why-now-title" className={styles.eventTitle}>
            1<sup>er</sup>&nbsp;septembre 2027&#8239;: les PME devront émettre leurs factures au format électronique.
          </h2>
          <p className={styles.eventText}>
            Un système propre se monte en 2 à 3 mois. Commencé à l’été 2027, il se fera dans l’urgence.{' '}
            <Link href="/articles/facturation-electronique-2026" className={styles.textLink}>
              Ce que change la réforme
            </Link>
          </p>
          <p className={styles.eventAction}>
            <Link href="/diagnostic-facture-electronique/" className={styles.button}>
              Faire le diagnostic gratuit (2&nbsp;min)
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  </section>
);
