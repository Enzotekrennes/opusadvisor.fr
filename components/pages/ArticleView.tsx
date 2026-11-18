'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { PageHero } from '@/components/sections/PageHero';
import { InvoiceSheet } from '@/components/pages/InvoiceSheet';
import sections from '@/components/sections/sections.module.css';

const INK = '#13213D';
const INK_SOFT = '#56627E';
const NAVY = '#1E3A66';
const GROUND = '#F3F5F9';
const RULE = '#E6EAF1';

const DEFAULT_CTA = {
  text: 'Vous voulez savoir où part le temps dans votre entreprise ? On regarde vos outils ensemble pendant 30 minutes, en visio. C’est gratuit.',
  label: 'Réserver le pré-audit',
  href: '/contact/',
};

interface ArticleViewProps {
  title: string;
  description: string;
  content: string;
  publishedLabel?: string;
  updatedLabel?: string;
  readingMinutes: number;
  essentiel?: string[];
  faq?: { q: string; a: string }[];
  ctaMid?: { text: string; label: string; href: string };
}

/** Coupe le markdown juste avant le 3e intertitre, pour y glisser l'encart. */
function splitBeforeThirdH2(md: string): [string, string] {
  const re = /^## /gm;
  let count = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(md))) {
    count += 1;
    if (count === 3) return [md.slice(0, match.index), md.slice(match.index)];
  }
  return [md, ''];
}

/**
 * Each table gets a wrapper: below 640 px, CSS (globals.css, .article-table) stacks its rows instead of squeezing two columns.
 * A code block tagged `facture` is an invoice example, laid out as a document (InvoiceSheet); other blocks stay preformatted.
 */
const markdownComponents: Components = {
  table: ({ node: _node, ...props }) => (
    <div className="article-table">
      <table {...props} />
    </div>
  ),
  pre: ({ node: _node, children, ...props }) => {
    const code = React.Children.toArray(children)[0];
    if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(code) && code.props.className?.includes('language-facture')) {
      return <InvoiceSheet text={String(code.props.children ?? '')} />;
    }
    return <pre {...props}>{children}</pre>;
  },
};

const Markdown: React.FC<{ children: string }> = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>
    {children}
  </ReactMarkdown>
);

export const ArticleView: React.FC<ArticleViewProps> = ({
  title,
  description,
  content,
  publishedLabel,
  updatedLabel,
  readingMinutes,
  essentiel,
  faq,
  ctaMid,
}) => {
  const [tocPosition, setTocPosition] = useState<'absolute' | 'fixed' | 'absolute-bottom'>('absolute');
  const articleSectionRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleSectionRef.current || !tocRef.current) return;
      const articleRect = articleSectionRef.current.getBoundingClientRect();
      const tocHeight = tocRef.current.offsetHeight;
      const stickyStartOffset = 96;

      if (articleRect.top > stickyStartOffset) {
        setTocPosition('absolute');
      } else if (articleRect.bottom < tocHeight + stickyStartOffset) {
        setTocPosition('absolute-bottom');
      } else {
        setTocPosition('fixed');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  const [before, after] = splitBeforeThirdH2(content);
  const cta = ctaMid ?? DEFAULT_CTA;

  return (
    <>
      <PageHero titleId="article-title" back={{ href: '/articles/', label: 'Tous les articles' }} title={title} lede={description}>
        <div className="mt-7 flex items-center gap-3">
          <img src="/images/enzo.jpg" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover shadow-[0_0_0_2px_rgba(255,255,255,0.25)]" />
          <div className="text-[14.5px] leading-snug text-white/80">
            <Link href="/equipe/" className="font-semibold text-white underline-offset-4 hover:underline">
              Enzo Monnier
            </Link>
            <span> · {readingMinutes} min de lecture</span>
            <div>
              {publishedLabel && <>Publié le {publishedLabel}</>}
              {updatedLabel && <> · Mis à jour le {updatedLabel}</>}
            </div>
          </div>
        </div>
      </PageHero>

      <div className="relative bg-white pt-14 pb-16 font-[family-name:var(--font-inter)] md:pt-16" ref={articleSectionRef}>
        <div
          ref={tocRef}
          className={`hidden xl:block xl:w-64 ${
            tocPosition === 'fixed' ? 'fixed left-8 top-24' : tocPosition === 'absolute-bottom' ? 'absolute left-8 bottom-4' : 'absolute left-8 top-14'
          }`}
          style={{ transition: 'none' }}
        >
          <TableOfContents content={content} />
        </div>

        {/* About 68 characters a line. From xl the fixed table of contents takes 288 px on the left: the text moves aside while the screen cannot centre it. */}
        <div className="container mx-auto px-6 max-w-[46rem] xl:mr-auto xl:ml-[max(19rem,calc((100%_-_46rem)/2))]">
          {essentiel && essentiel.length > 0 && (
            <aside aria-labelledby="essentiel-titre" className="mb-10 rounded-2xl px-6 py-6" style={{ background: GROUND }}>
              <p id="essentiel-titre" className="text-[15px] font-semibold" style={{ color: INK }}>
                L'essentiel en 30 secondes
              </p>
              <ul className="mt-4 space-y-3">
                {essentiel.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed md:text-lg" style={{ color: '#3C4866' }}>
                    <Check size={18} strokeWidth={2.6} aria-hidden="true" className="mt-1 shrink-0" style={{ color: '#1E7B43' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <article
            className="prose prose-lg max-w-none
              prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:leading-relaxed prose-p:mb-4 prose-p:text-lg
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
              prose-li:text-lg prose-li:leading-relaxed
              prose-strong:font-semibold
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-medium
              prose-hr:my-8
            "
          >
            <Markdown>{before}</Markdown>
            {after && (
              <aside className="not-prose my-10 flex flex-col gap-5 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:gap-8" style={{ background: GROUND }}>
                <div className="flex-1 text-base leading-relaxed md:text-lg" style={{ color: INK }}>
                  {cta.text}
                </div>
                <Link href={cta.href} data-plain className={`${sections.button} self-start sm:self-auto`}>
                  {cta.label}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </aside>
            )}
            {after && <Markdown>{after}</Markdown>}
          </article>

          {faq && faq.length > 0 && (
            <section aria-labelledby="faq-titre" className="mt-16">
              <h2 id="faq-titre" className="mb-6 text-3xl font-bold" style={{ color: INK }}>
                Questions fréquentes
              </h2>
              <div className={sections.faq}>
                {faq.map((item, i) => (
                  <details key={item.q} open={i === 0} className={sections.question}>
                    <summary>
                      <span>{item.q}</span>
                      <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
                    </summary>
                    <div className={sections.answer}>
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section aria-label="L'auteur" className="mt-16 flex gap-5 rounded-2xl px-6 py-6" style={{ background: GROUND }}>
            <img src="/images/enzo.jpg" alt="Enzo Monnier" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover" />
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: INK_SOFT }}>
                Écrit par
              </p>
              <p className="mt-1 text-lg font-semibold" style={{ color: INK }}>
                Enzo Monnier, fondateur d'Opus Advisor
              </p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed" style={{ color: '#3C4866' }}>
                Trois ans de développement de logiciels métier avant de passer au conseil. Depuis Vannes, il automatise la
                gestion des petites entreprises : organismes de formation, conciergeries, entreprises du bâtiment.
              </p>
              <Link href="/equipe/" className={`${sections.more} mt-3`} style={{ fontSize: 14.5 }}>
                L'équipe
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
