'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { desktopDock } from '@/lib/homeDesktop';
import { DesktopGlyph } from './DesktopGlyph';
import styles from './desktop.module.css';

/** Extra scale of the tile right under the pointer (macOS-like magnification). */
const MAX_GROWTH = 0.4;
/** Spread of the magnification, in px²: tiles about 85 px away still grow a little. */
const SPREAD = 7200;

/**
 * The Dock of the home desktop: the trades and the ways in, as links. Under a mouse, tiles grow with
 * their closeness to the pointer; on touch screens, and when the visitor asks for reduced motion, they
 * stay still. Phones keep the entries marked `compact`.
 */
export const Dock: React.FC = () => {
  const apps = useRef<(HTMLAnchorElement | null)[]>([]);

  /** Scales each tile from its horizontal distance to the pointer (Gaussian falloff); never with reduced motion. */
  const magnify = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const app of apps.current) {
      if (!app) continue;
      const r = app.getBoundingClientRect();
      const d = event.clientX - (r.left + r.width / 2);
      app.style.setProperty('--s', (1 + MAX_GROWTH * Math.exp(-(d * d) / SPREAD)).toFixed(3));
    }
  };

  const rest = () => apps.current.forEach((app) => app?.style.setProperty('--s', '1'));

  return (
    <nav className={styles.dock} aria-label="Secteurs et accès rapides" onPointerMove={magnify} onPointerLeave={rest}>
      {desktopDock.map((item, i) =>
        item === null ? (
          <span key={`sep-${i}`} className={styles.dockSeparator} aria-hidden="true" />
        ) : (
          <Link
            key={item.href + item.label}
            ref={(el) => {
              apps.current[i] = el;
            }}
            href={item.href}
            className={`${styles.app} ${item.accent ? styles.appAccent : ''} ${item.compact ? '' : styles.appWide}`}
          >
            <span className={styles.tile}>
              <DesktopGlyph icon={item.icon} size={26} />
            </span>
            <span className={styles.appLabel}>{item.label}</span>
            {item.accent && <i className={styles.appDot} aria-hidden="true" />}
          </Link>
        ),
      )}
    </nav>
  );
};
