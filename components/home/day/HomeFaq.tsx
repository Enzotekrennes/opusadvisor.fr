import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';
import type { Faq } from '@/lib/faqData';
import styles from './day.module.css';

/**
 * Home page: the questions, as a grouped list of native <details>. Every answer is in the HTML (readable
 * by search engines and without JavaScript) and opens from the keyboard without any script.
 */
export const HomeFaq: React.FC<{ items: Faq[] }> = ({ items }) => (
  <section className={`${styles.section} ${styles.ground}`} aria-labelledby="faq-title">
    <div className={styles.narrow}>
      <h2 id="faq-title" className={`${styles.title} ${styles.centered}`} data-reveal>
        Vos questions
      </h2>
      <div className={styles.faq} data-reveal data-reveal-delay="1">
        {items.map((faq, index) => (
          <details key={faq.question} open={index === 0} className={styles.question}>
            <summary>
              <span>{faq.question}</span>
              <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
            </summary>
            <div className={styles.answer}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);
