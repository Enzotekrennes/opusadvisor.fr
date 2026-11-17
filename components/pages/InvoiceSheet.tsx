import React from 'react';
import { Window } from '@/components/sections/Window';
import styles from './InvoiceSheet.module.css';

/**
 * An invoice example from an article, laid out as a document in a window instead of a block of
 * monospaced text. Fed by a Markdown code block tagged `facture`, whose text stays exactly as written:
 * only the layout is read from it.
 *
 * Reading rules, line by line:
 * - a blank line starts a new block of the invoice;
 * - a line indented by two spaces or more is a detail of the line above;
 * - a line ending with an amount (« 2 800,00 € ») is an amount row, label on the left, figure on the right;
 * - a line starting with « FACTURE » is the invoice's title;
 * - a line « label : value » shows the label in grey and the value in ink.
 * A block made only of amount rows is a totals block, aligned right, its last row in bold. The blocks
 * after it (payment terms) are set smaller. On a whole invoice (one with a « FACTURE » line), the first
 * block is the issuer: its first line in bold, the rest in grey. An excerpt keeps every line alike.
 */

type Line =
  | { kind: 'text'; text: string }
  | { kind: 'detail'; text: string }
  | { kind: 'title'; text: string }
  | { kind: 'field'; label: string; value: string }
  | { kind: 'amount'; label: string; value: string };

/** Label, then an amount in euros with cents at the end of the line, any spaces in between. */
const AMOUNT = /^(.*?\S)\s+(\d[\d\s  ]*,\d{2}\s?€)$/;
const FIELD = /^(.+?) : (.+)$/;
const TITLE = /^FACTURE\b/;
const DETAIL = /^\s{2,}\S/;

/** Classifies one line of the invoice text (see the reading rules above). */
function readLine(raw: string): Line {
  if (DETAIL.test(raw)) return { kind: 'detail', text: raw.trim() };
  const amount = AMOUNT.exec(raw);
  if (amount) return { kind: 'amount', label: amount[1], value: amount[2] };
  if (TITLE.test(raw)) return { kind: 'title', text: raw };
  const field = FIELD.exec(raw);
  if (field) return { kind: 'field', label: field[1], value: field[2] };
  return { kind: 'text', text: raw };
}

/** Splits the invoice text into blocks of lines; Windows line endings and trailing spaces are dropped. */
function readBlocks(text: string): Line[][] {
  return text
    .replace(/\r/g, '')
    .split(/\n[ \t]*\n/)
    .map((block) => block.split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l !== ''))
    .filter((block) => block.length > 0)
    .map((block) => block.map(readLine));
}

const LineView: React.FC<{ line: Line; first: boolean }> = ({ line, first }) => {
  switch (line.kind) {
    case 'title':
      return <div className={styles.title}>{line.text}</div>;
    case 'detail':
      return <div className={styles.detail}>{line.text}</div>;
    case 'field':
      return (
        <div className={styles.line}>
          <span className={styles.label}>{line.label} :</span> {line.value}
        </div>
      );
    case 'amount':
      return (
        <div className={styles.line}>
          {line.label} <span className={styles.figure}>{line.value}</span>
        </div>
      );
    default:
      return <div className={first ? styles.issuer : styles.line}>{line.text}</div>;
  }
};

/** @param text the raw content of the `facture` code block. */
export const InvoiceSheet: React.FC<{ text: string }> = ({ text }) => {
  const blocks = readBlocks(text);
  const totalsAt = blocks.findIndex((b) => b.every((l) => l.kind === 'amount'));
  const whole = blocks.some((b) => b.some((l) => l.kind === 'title'));

  return (
    <div className={`not-prose ${styles.wrap}`}>
      <Window>
        <div className={styles.sheet}>
          {blocks.map((block, b) => {
            if (b === totalsAt) {
              return (
                <div key={b} className={`${styles.block} ${styles.totals}`}>
                  {block.map((line, i) =>
                    line.kind === 'amount' ? (
                      <div key={i} className={i === block.length - 1 ? `${styles.total} ${styles.grand}` : styles.total}>
                        <span>{line.label}</span>
                        <span className={styles.figure}>{line.value}</span>
                      </div>
                    ) : null,
                  )}
                </div>
              );
            }
            const terms = totalsAt !== -1 && b > totalsAt;
            const issuer = whole && b === 0;
            return (
              <div key={b} className={`${styles.block} ${terms ? styles.terms : ''} ${issuer ? styles.head : ''}`}>
                {block.map((line, i) => (
                  <LineView key={i} line={line} first={issuer && i === 0} />
                ))}
              </div>
            );
          })}
        </div>
      </Window>
    </div>
  );
};
