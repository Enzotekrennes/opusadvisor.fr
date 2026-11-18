'use client';

import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const h2Elements = document.querySelectorAll('article h2');
      const extractedHeadings: Heading[] = [];

      h2Elements.forEach((h2) => {
        const id = h2.getAttribute('id');
        const text = h2.textContent;

        if (id && text) {
          extractedHeadings.push({ id, text, level: 2 });
        }
      });

      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  // The current section is the last heading that has passed a line a quarter down the screen. Worked out on
  // every scroll rather than when a heading crosses that line, so a jump (a click in this list, the browser
  // restoring the position, a link to an anchor) lands on the right row, and nothing is lit above the first one.
  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      let current = '';
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Sommaire"
      className="w-full rounded-[var(--radius-card)] bg-white p-5 font-[family-name:var(--font-inter)] shadow-[var(--shadow-card)]"
    >
      <p className="mb-3 px-2 text-[13px] font-semibold text-[#56627E]">Sommaire</p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? 'location' : undefined}
              className={`block rounded-lg px-2 py-1.5 text-[14.5px] leading-snug transition-colors duration-200 ${
                activeId === heading.id ? 'bg-[#EEF2F8] font-semibold text-[#1E3A66]' : 'text-[#56627E] hover:text-[#13213D]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - 100;
                  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  window.scrollTo({ top: offsetPosition, behavior: reduce ? 'auto' : 'smooth' });
                  history.replaceState(null, '', `#${heading.id}`);
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
