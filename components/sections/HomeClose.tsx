import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Video } from 'lucide-react';
import { Window } from './Window';
import styles from './sections.module.css';

/** Planes of the town drawn for the hero, reused still: the same town at the end of the day. */
const TOWN_PLANES = [5, 4, 3, 2, 1];

/**
 * Home page close, back outside at dusk over the same town as the morning hero: one way in, the free
 * pre-audit, shown as an invitation with what the visitor leaves with, and the paid Audit Stack as a
 * quiet link. Still: nothing moves here. Its id `contact` also tells the mobile booking bar to step aside.
 */
export const HomeClose: React.FC = () => (
  <section id="contact" className={`${styles.section} ${styles.dusk}`} aria-labelledby="cta-title" data-surface="dark">
    <div className={styles.duskTown} aria-hidden="true">
      {TOWN_PLANES.map((n) => (
        <img key={n} src={`/images/home/town/layer-${n}.svg`} alt="" width={1520} height={980} loading="lazy" decoding="async" />
      ))}
    </div>

    <div className={`${styles.inner} ${styles.closeGrid}`}>
      <div data-reveal>
        <h2 id="cta-title" className={styles.closeTitle}>
          Commencez par le pré-audit
        </h2>
        <p className={styles.closeLede}>
          30 minutes en visio, gratuites et sans engagement. Vous partagez votre écran, et on regarde vos outils ensemble.
        </p>
        <p className={styles.closeAside}>
          Vous voulez seulement un avis écrit et chiffré sur vos outils&#8239;?{' '}
          <Link href="/services#audit-stack">L’Audit Stack</Link> coûte 990&nbsp;€ et se livre en 10 jours ouvrés.
        </p>
      </div>

      <div data-reveal data-reveal-delay="2">
        <Window title="Invitation" className={styles.invite}>
          <div className={styles.inviteBody}>
            <p className={styles.inviteTitle}>Pré-audit gratuit</p>
            <p className={styles.inviteMeta}>
              <span>
                <Clock size={15} strokeWidth={2} aria-hidden="true" />
                30 min
              </span>
              <span>
                <Video size={15} strokeWidth={2} aria-hidden="true" />
                En visio, écran partagé
              </span>
            </p>
            <p className={styles.inviteWith}>
              <img src="/images/enzo-avatar.webp" alt="" width={36} height={36} loading="lazy" />
              <span>
                Avec <b>Enzo Monnier</b>, le fondateur
              </span>
            </p>
            <div className={styles.inviteList}>
              <p>Vous repartez avec&#8239;:</p>
              <ul>
                <li>
                  <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                  <span>3 points de friction repérés dans vos outils, avec la façon de régler chacun&#8239;;</span>
                </li>
                <li>
                  <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                  <span>un avis franc&#8239;: si une mission ne vaut pas le coup pour vous, on vous le dit.</span>
                </li>
              </ul>
            </div>
            <div className={styles.inviteActions}>
              <Link href="/contact" className={styles.button}>
                Réserver le pré-audit gratuit
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </Link>
              <p className={styles.inviteNote}>
                Créneaux disponibles sous 5 jours. Annulation libre jusqu’à 2&nbsp;h avant. Plutôt un appel&#8239;:{' '}
                <a href="tel:+33615756549">06&nbsp;15&nbsp;75&nbsp;65&nbsp;49</a>
              </p>
            </div>
          </div>
        </Window>
      </div>
    </div>
  </section>
);
