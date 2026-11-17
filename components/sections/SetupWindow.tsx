import React from 'react';
import { Section, SectionHead } from './Section';
import { Window } from './Window';
import styles from './inner.module.css';

/**
 * A section describing what is set up, one row per piece: what it is, with which tools (a tag), and
 * what it changes, inside a window.
 *
 * @param windowTitle text of the window's title bar, decorative.
 */
export const SetupWindow: React.FC<{
  id: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  windowTitle: string;
  items: { what: string; tools?: string; desc: string }[];
  tone?: 'ground' | 'white';
}> = ({ id, title, lede, windowTitle, items, tone }) => (
  <Section tone={tone} labelledBy={id}>
    <SectionHead id={id} title={title} lede={lede} />
    <div className={styles.setup} data-reveal data-reveal-delay="1">
      <Window title={windowTitle}>
        <dl>
          {items.map((item) => (
            <div key={item.what} className={styles.setupRow}>
              <dt>
                <b>{item.what}</b>
                {item.tools && <span>{item.tools}</span>}
              </dt>
              <dd>{item.desc}</dd>
            </div>
          ))}
        </dl>
      </Window>
    </div>
  </Section>
);
