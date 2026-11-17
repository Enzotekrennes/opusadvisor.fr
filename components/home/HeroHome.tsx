import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { desktopSectors } from '@/lib/homeDesktop';
import { DesktopGlyph } from '@/components/home/desktop/DesktopGlyph';
import { TownScene } from '@/components/home/desktop/TownScene';
import { AppWindow } from '@/components/home/desktop/AppWindow';
import { Notifications } from '@/components/home/desktop/Notifications';
import { Dock } from '@/components/home/desktop/Dock';
import { DesktopControls } from '@/components/home/desktop/DesktopControls';
import styles from '@/components/home/desktop/desktop.module.css';

/** Id of the hero section, read by the motion controls and the home header. */
export const HERO_ID = 'bureau';

/**
 * First screen of the home page, drawn as a computer desktop at dawn over a town with a building
 * site: the promise and the way in on the left, and an example window on the right where each
 * trade's documents leave on their own, with a notification for each and a Dock of shortcuts.
 * The menu bar at the top is the site header, the same on every page. Text, links and the example are
 * readable without JavaScript; the motion starts with it, can be paused, and keeps only fades when
 * the visitor asks for reduced motion.
 */
export const HeroHome: React.FC = () => (
  <section id={HERO_ID} className={styles.desk} aria-labelledby="hero-title" data-booking-hero>
    <TownScene />

    <div className={styles.grid}>
      <div className={styles.copy}>
        <ul className={styles.sectors} aria-label="Secteurs accompagnés">
          {desktopSectors.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>
                <DesktopGlyph icon={s.icon} size={16} />
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <h1 id="hero-title" className={styles.title}>
          Ce que votre équipe ressaisit à la main, on le fait partir tout seul.
        </h1>

        <p className={styles.lede}>
          Dossiers de financement, factures des propriétaires, devis et relances&#8239;: on relie vos logiciels et on
          automatise ce qui se fait encore à la main. Puis on reste pour faire tourner le système.
        </p>

        <div className={styles.ctas}>
          <Link href="/contact" className={styles.primary}>
            Réserver le pré-audit gratuit
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link href="/cas-clients" className={styles.secondary}>
            Voir ce qu’on a déjà mis en place
          </Link>
        </div>

        {/* The pre-audit is booked on Enzo's own calendar: show who the visitor will talk to, in the first screen. */}
        <div className={styles.who}>
          <img src="/images/enzo-avatar.webp" alt="" width={42} height={42} />
          <p>
            30&nbsp;min en visio avec <b>Enzo Monnier</b>, le fondateur, basé à Vannes.
            <br />
            Plutôt un appel&#8239;: <a href="tel:+33615756549">06&nbsp;15&nbsp;75&nbsp;65&nbsp;49</a>
          </p>
        </div>
      </div>

      <figure className={styles.demo}>
        <Notifications />
        <AppWindow />
        <figcaption className={styles.caption}>
          <span>Fenêtre et notifications d’exemple, données fictives.</span>
          <DesktopControls heroId={HERO_ID} />
        </figcaption>
      </figure>
    </div>

    <Dock />
  </section>
);
