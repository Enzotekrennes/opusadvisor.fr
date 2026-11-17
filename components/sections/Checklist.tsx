'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Window } from './Window';
import sections from './sections.module.css';
import styles from './inner.module.css';

/**
 * Pains the visitor can tick, with a count and a message that changes with it, inside a window.
 * Without JavaScript the list reads as a plain list and the first message (nothing ticked) shows.
 *
 * @param messages one message per number of ticked boxes, from 0 to the number of items.
 * @param threshold from this many ticks the booking button turns primary.
 */
export const Checklist: React.FC<{
  prompt: string;
  items: { title: string; desc: string }[];
  messages: string[];
  threshold: number;
}> = ({ prompt, items, messages, threshold }) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const count = checked.size;
  const hot = count >= threshold;

  const toggle = (title: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <>
      <p className={styles.prompt}>{prompt}</p>
      <div className="mt-4">
        <Window title="Votre semaine">
          <ul className={styles.checklist}>
            {items.map((item) => (
              <li key={item.title} className={styles.checkItem}>
                <label>
                  <input type="checkbox" checked={checked.has(item.title)} onChange={() => toggle(item.title)} />
                  <span>
                    <span className={styles.checkTitle}>{item.title}</span>
                    <span className={styles.checkText}>{item.desc}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className={styles.score}>
            <p className={styles.count} aria-hidden="true">
              {count} <small>/ {items.length}</small>
            </p>
            <p className={styles.message} aria-live="polite">
              <span className="sr-only">
                {count} cases cochées sur {items.length}.{' '}
              </span>
              {messages[count]}
            </p>
            <Link href="/contact" className={hot ? sections.button : styles.outlineButton}>
              {hot ? 'Réserver mon pré-audit gratuit' : 'Faire le pré-audit'}
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </Window>
      </div>
    </>
  );
};
