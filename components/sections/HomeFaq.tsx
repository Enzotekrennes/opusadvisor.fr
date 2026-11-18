import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';
import type { Faq } from '@/lib/faqData';
import { Section } from './Section';
import { frenchSpacing } from '@/lib/typo';
import styles from './sections.module.css';

/**
 * Questions as a grouped list of native <details>. Every answer is in the HTML (readable by search
 * engines and without JavaScript) and opens from the keyboard without any script. The first one is open.
 */
export const HomeFaq: React.FC<{ items: Faq[]; title?: string; tone?: 'ground' | 'white' }> = ({
  items,
  title = 'Questions fréquentes',
  tone = 'ground',
}) => (
  <Section tone={tone} labelledBy="faq-title" narrow>
    <h2 id="faq-title" className={`${styles.title} ${styles.centered}`} data-reveal>
      {title}
    </h2>
    <div className={styles.faq} data-reveal data-reveal-delay="1">
      {items.map((faq, index) => (
        <details key={faq.question} open={index === 0} className={styles.question}>
          <summary>
            <span>{frenchSpacing(faq.question)}</span>
            <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
          </summary>
          <div className={styles.answer}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
          </div>
        </details>
      ))}
    </div>
  </Section>
);
