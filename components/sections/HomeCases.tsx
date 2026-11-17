import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cases } from '@/lib/cases';
import { Section, SectionHead } from './Section';
import { WindowCards } from './WindowCards';
import styles from './sections.module.css';

/**
 * The three real missions, unnamed, as three windows, each opening its full story on the Cases page.
 * On the home page it sits right under the desktop hero and answers its last link.
 */
export const HomeCases: React.FC<{ title?: string; tone?: 'ground' | 'white' }> = ({
  title = 'Ce qu’on a déjà mis en place.',
  tone = 'ground',
}) => (
  <Section tone={tone} labelledBy="cases-title">
    <SectionHead id="cases-title" title={title} lede="Trois missions récentes, présentées sans le nom des clients." centered />
    <WindowCards
      items={cases.map((c) => ({
        key: c.slug,
        label: c.client,
        title: c.title,
        text: c.summary,
        pill: c.level.charAt(0).toUpperCase() + c.level.slice(1),
        href: `/cas-clients/#${c.slug}`,
      }))}
    />
    <p className={styles.below} data-reveal>
      <Link href="/cas-clients" className={styles.more}>
        Tous les cas clients
        <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
      </Link>
    </p>
  </Section>
);
