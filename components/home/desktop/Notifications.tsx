import React from 'react';
import { desktopNotifications } from '@/lib/homeDesktop';
import { DesktopGlyph } from './DesktopGlyph';
import styles from './desktop.module.css';

/** Seconds into the 15 s cycle at which each trade's last document leaves the example window. */
const LANDING = [2.4, 7.4, 12.4];

/**
 * Notifications of the home desktop: each one lands when the example window sends a trade's last
 * document, then slides back under the next one, like macOS stacks them. Driven by CSS on the same
 * 15 s cycle as the window. Without JavaScript only the first one shows.
 */
export const Notifications: React.FC = () => (
  <ul className={styles.notifications} aria-label="Exemples de notifications">
    {desktopNotifications.map((n, i) => (
      <li key={n.title} className={styles.notification} style={{ animationDelay: `${LANDING[i]}s` }}>
        <span className={styles.notificationIcon}>
          <DesktopGlyph icon={n.icon} size={20} />
        </span>
        <span className={styles.notificationBody}>
          <span className={styles.notificationHead}>
            <small>{n.app}</small>
            <em>maintenant</em>
          </span>
          <b>{n.title}</b>
          <span>{n.body}</span>
        </span>
      </li>
    ))}
  </ul>
);
