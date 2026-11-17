import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { methodSteps } from '@/lib/method';
import { Section } from './Section';
import { Window } from './Window';
import styles from './sections.module.css';

/**
 * The four steps of a mission and their public prices, as a table in a window, then the Audit Stack as
 * a standalone alternative and a link to the details on the Services page. Home page and sector pages.
 */
export const HomeMethod: React.FC<{ tone?: 'ground' | 'white' }> = ({ tone = 'white' }) => (
  <Section id="methode" tone={tone} labelledBy="method-title">
    <div className={styles.methodHead} data-reveal>
      <h2 id="method-title" className={styles.title}>
        Comment on avance, et ce que ça coûte
      </h2>
      <p className={styles.lede}>Chaque étape est facturée à part. À la fin de chacune, vous décidez si on continue.</p>
    </div>

    <div className={styles.steps} data-reveal data-reveal-delay="1">
      <Window title="Étapes et tarifs">
        <table className={styles.stepsTable}>
          <caption className="sr-only">Les quatre étapes d’une mission et leur prix</caption>
          <thead>
            <tr>
              <th scope="col">Étape</th>
              <th scope="col">Ce qu’on fait</th>
              <th scope="col" className={styles.stepPrice}>
                Prix
              </th>
            </tr>
          </thead>
          <tbody>
            {methodSteps.map((s, i) => (
              <tr key={s.name}>
                <td className={styles.stepNumber}>{i + 1}</td>
                <td>
                  <span className={styles.stepName}>{s.name}</span>
                  <span className={styles.stepLine}>{s.line}</span>
                </td>
                <td className={styles.stepPrice}>
                  <span className={i === 0 ? styles.free : undefined}>{s.price}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Window>
    </div>

    <div className={styles.methodFoot}>
      <p>
        Vous voulez seulement un avis écrit et chiffré sur vos outils&#8239;?{' '}
        <Link href="/services#audit-stack" className={styles.textLink}>
          L’Audit Stack
        </Link>{' '}
        coûte 990&nbsp;€ et se livre en 10 jours ouvrés.
      </p>
      <Link href="/services" className={styles.more}>
        Le détail de chaque étape
        <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  </Section>
);
