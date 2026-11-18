import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { DesktopIcon } from '@/lib/homeDesktop';
import { DesktopGlyph } from '@/components/home/desktop/DesktopGlyph';
import { frenchSpacing } from '@/lib/typo';
import styles from './inner.module.css';

/** Planes of the town drawn for the home page, from the farthest to the rooftop in front. */
const TOWN_PLANES = [5, 4, 3, 2, 1];

/** The town of the home page, still, as a band along the bottom of a dark section (decorative). */
export const TownBand: React.FC = () => (
  <div className={styles.town} aria-hidden="true">
    {TOWN_PLANES.map((n) => (
      <img key={n} src={`/images/home/town/layer-${n}.svg`} alt="" width={1520} height={980} decoding="async" />
    ))}
  </div>
);

/**
 * Top of an inner page, under the same dawn sky and town as the home page desktop, still. Holds the page's
 * h1 and lede, optional chips, a link back to the parent page, the page's actions (children) and an
 * optional panel on the right (`aside`), such as an example window.
 *
 * @param titleId id given to the h1, which labels the section.
 */
export const PageHero: React.FC<{
  title: React.ReactNode;
  titleId: string;
  lede?: React.ReactNode;
  back?: { href: string; label: string };
  chips?: { label: string; icon?: DesktopIcon }[];
  aside?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ title, titleId, lede, back, chips, aside, children }) => (
  <section className={styles.pageHero} aria-labelledby={titleId} data-booking-hero data-surface="dark">
    <TownBand />

    <div className={`${styles.heroGrid} ${aside ? styles.heroWithAside : ''}`}>
      <div className={styles.heroCopy}>
        {back && (
          <Link href={back.href} className={styles.back}>
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        {chips && (
          <ul className={styles.chips}>
            {chips.map((c) => (
              <li key={c.label}>
                {c.icon && <DesktopGlyph icon={c.icon} size={16} />}
                {c.label}
              </li>
            ))}
          </ul>
        )}
        <h1 id={titleId} className={styles.heroTitle}>
          {frenchSpacing(title)}
        </h1>
        {lede && <p className={styles.heroLede}>{frenchSpacing(lede)}</p>}
        {children}
      </div>
      {aside && <div className={styles.heroAside}>{aside}</div>}
    </div>
  </section>
);

/** The page's booking button and an optional secondary link, white on the dawn sky. */
export const HeroActions: React.FC<{ secondary?: { href: string; label: string } }> = ({ secondary }) => (
  <div className={styles.heroActions}>
    <Link href="/contact" className={styles.lightButton}>
      Réserver le pré-audit gratuit
      <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
    </Link>
    {secondary && (
      <Link href={secondary.href} className={styles.lightLink}>
        {secondary.label}
      </Link>
    )}
  </div>
);
