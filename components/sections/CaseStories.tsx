import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ClientCase } from '@/lib/cases';
import { CaseVisual } from '@/components/motion/CaseVisual';
import { Section, SectionHead } from './Section';
import { Window } from './Window';
import sections from './sections.module.css';
import styles from './inner.module.css';

/** The level label, capitalised for the pill. */
const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Real missions told in full, one window each: the client (unnamed), the title and the level of the
 * answer, then before, what was done and today; below, the mission's animated visual and its caption.
 * Each story carries the case's slug as id, so other pages can link to it.
 */
export const CaseStories: React.FC<{
  id: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  cases: ClientCase[];
  link?: { href: string; label: string };
  tone?: 'ground' | 'white';
}> = ({ id, title, lede, cases, link, tone }) => (
  <Section tone={tone} labelledBy={id}>
    <SectionHead id={id} title={title} lede={lede} />
    <ul className={styles.stories}>
      {cases.map((c) => (
        <li key={c.slug} id={c.slug} className={styles.story} data-reveal>
          <Window title="Cas client">
            <div className={styles.storyBody}>
              <div>
                <p className={styles.storyClient}>{c.client}</p>
                <h3 className={styles.storyTitle}>{c.title}</h3>
                <p className={styles.storyLevel}>
                  <span className={sections.pill}>{capitalise(c.level)}</span>
                </p>
              </div>
              <dl className={styles.storyRows}>
                {[
                  ['Avant', c.before],
                  ['Ce qu’on a fait', c.done],
                  ['Aujourd’hui', c.result],
                ].map(([label, text]) => (
                  <div key={label} className={styles.storyRow}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {c.visual && (
              <figure className={styles.storyVisual}>
                <div>
                  <CaseVisual slug={c.slug} />
                </div>
                <figcaption>{c.visual.caption}</figcaption>
              </figure>
            )}
          </Window>
        </li>
      ))}
    </ul>
    {link && (
      <p className={styles.headLink}>
        <Link href={link.href} className={sections.more}>
          {link.label}
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </p>
    )}
  </Section>
);
