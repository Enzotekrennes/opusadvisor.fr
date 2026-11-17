import React from 'react';
import { Check, ListFilter, Search } from 'lucide-react';
import { desktopPanels } from '@/lib/homeDesktop';
import { DesktopGlyph } from './DesktopGlyph';
import styles from './desktop.module.css';

/**
 * The example application window of the home desktop: one trade at a time, its documents already
 * handled, and the last one going out while the visitor watches (a spinner, then "sent").
 * The trades take turns on a 15 s cycle driven by CSS: each trade owns a third of it, set by a
 * negative animation delay, so the sidebar, the table and the notifications stay in step without
 * any script. Without JavaScript, or before the cycle starts, the first trade is shown with every
 * document sent.
 */

/** Start of each trade's third of the 15 s cycle (negative delays: the cycle is already running). */
const PHASE = ['0s', '-10s', '-5s'];

/** Inline style carrying a trade's phase to its animated parts. */
const phase = (i: number) => ({ '--d': PHASE[i] }) as React.CSSProperties;

const Lights: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`${styles.lights} ${className}`} aria-hidden="true">
    <i />
    <i />
    <i />
  </div>
);

const Done: React.FC<{ label: string }> = ({ label }) => (
  <span className={`${styles.status} ${styles.done}`}>
    <Check size={12} strokeWidth={2.6} aria-hidden="true" />
    {label}
  </span>
);

export const AppWindow: React.FC = () => (
  <div className={styles.window}>
    <aside className={styles.sidebar}>
      <Lights />
      <p className={styles.sidebarTitle}>Secteurs</p>
      <ul>
        {desktopPanels.map((p, i) => (
          <li key={p.sidebar} className={styles.sidebarItem} style={phase(i)}>
            <DesktopGlyph icon={p.icon} size={16} />
            <span>{p.sidebar}</span>
            <em aria-hidden="true">4</em>
          </li>
        ))}
      </ul>
      <p className={styles.auto}>
        <i aria-hidden="true" />
        Automatique · actif
      </p>
    </aside>

    <div className={styles.main}>
      <div className={styles.toolbar}>
        <Lights className={styles.toolbarLights} />
        <div>
          <p className={styles.toolbarTitle}>Envois automatiques</p>
          <p className={styles.toolbarDate}>Ce matin, 07:52</p>
        </div>
        <div className={styles.tools} aria-hidden="true">
          <span>
            <ListFilter size={15} strokeWidth={1.8} />
          </span>
          <span>
            <Search size={15} strokeWidth={1.8} />
          </span>
        </div>
      </div>

      {/* On phones the sidebar gives way to tabs above the table. */}
      <ul className={styles.tabs} aria-hidden="true">
        {desktopPanels.map((p, i) => (
          <li key={p.sidebar} className={styles.tab} style={phase(i)}>
            {p.sidebar}
          </li>
        ))}
      </ul>

      <div className={styles.panels}>
        {desktopPanels.map((p, i) => (
          <table key={p.sidebar} className={styles.panel} style={phase(i)}>
            <caption className="sr-only">{`${p.sidebar} : documents envoyés automatiquement ce matin`}</caption>
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">{p.subject}</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {p.rows.map(([doc, subject, state]) => (
                <tr key={doc}>
                  <td>{doc}</td>
                  <td>{subject}</td>
                  <td>
                    <Done label={state} />
                  </td>
                </tr>
              ))}
              <tr className={styles.sending}>
                <td>{p.sending[0]}</td>
                <td>{p.sending[1]}</td>
                <td>
                  <span className={styles.swap}>
                    <span className={`${styles.status} ${styles.waiting}`} aria-hidden="true">
                      <i className={styles.spinner} />
                      En cours
                    </span>
                    <Done label={p.sending[2]} />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>

      <p className={styles.statusBar}>Personne n’a touché à ces documents ce matin.</p>
    </div>
  </div>
);
