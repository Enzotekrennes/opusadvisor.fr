import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { sectors } from '@/lib/sectors';
import type { SectorSlug } from '@/lib/cases';
import type { DesktopIcon } from '@/lib/homeDesktop';
import { DesktopGlyph } from '@/components/home/desktop/DesktopGlyph';
import styles from './day.module.css';

/** Each sector keeps the icon it has in the hero's Dock and chips. */
const ICONS: Record<SectorSlug, DesktopIcon> = { formation: 'formation', immobilier: 'conciergerie', btp: 'btp' };

/**
 * Home page: the three sectors, each with its app icon from the hero, what it covers and a link to its
 * page. The BTP card says plainly that there is no client case yet and points to the pilot programme.
 */
export const HomeSectors: React.FC = () => (
  <section id="secteurs" className={`${styles.section} ${styles.white} scroll-mt-24`} aria-labelledby="sectors-title">
    <div className={styles.inner}>
      <div className={`${styles.head} ${styles.centered}`} data-reveal>
        <h2 id="sectors-title" className={styles.title}>
          Les entreprises avec qui on travaille
        </h2>
        <p className={styles.lede}>
          Des petites entreprises et des PME, avec du travail sur le terrain et beaucoup d’administratif derrière. Les
          problèmes se ressemblent d’un secteur à l’autre&#8239;; les outils et le vocabulaire changent.
        </p>
      </div>

      <ul className={styles.sectors}>
        {sectors.map((s, i) => (
          <li key={s.slug} className={styles.sector} data-reveal data-reveal-delay={String(i + 1)}>
            <Link href={s.href} className={styles.sectorLink}>
              <span className={styles.appIcon} aria-hidden="true">
                <DesktopGlyph icon={ICONS[s.slug]} size={26} />
              </span>
              <span className={styles.sectorName}>{s.name}</span>
              <span className={styles.sectorShort}>{s.short}</span>
              <span className={styles.sectorMore}>
                Voir le détail
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
            {s.pilot && (
              <p className={styles.pilot}>
                {s.pilot.text}{' '}
                <Link href={s.pilot.href} className={styles.textLink}>
                  Voir le programme pilote
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className={styles.note} data-reveal>
        Votre secteur n’est pas dans la liste&#8239;? Si votre entreprise ressaisit les mêmes informations dans plusieurs
        outils, on peut sûrement vous aider. Le pré-audit sert à le vérifier.
      </p>
    </div>
  </section>
);
