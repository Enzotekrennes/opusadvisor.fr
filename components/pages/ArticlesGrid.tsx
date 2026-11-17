'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import sections from '@/components/sections/sections.module.css';

const INK = '#13213D';
const INK_SOFT = '#56627E';

interface ArticleMetadata {
  id: number;
  slug: string;
  title: string;
  description: string;
  publishedAt?: string;
  category?: string;
}

// Ordre d'affichage des filtres (les catégories absentes sont ignorées).
const CATEGORY_ORDER = ['Réglementation', 'Outils & systèmes', 'Organisation', 'Méthode'];

const formatDate = (d?: string): string => {
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(d));
  } catch {
    return '';
  }
};

/**
 * The list of articles as cards, newest first, with a filter by category. Every article is in the
 * static page; the filter only hides the others.
 */
export const ArticlesGrid: React.FC<{ articles: ArticleMetadata[] }> = ({ articles }) => {
  const [active, setActive] = useState<string>('Tous');

  const categories = useMemo(() => {
    const present = new Set(articles.map((a) => a.category).filter(Boolean) as string[]);
    return ['Tous', ...CATEGORY_ORDER.filter((c) => present.has(c))];
  }, [articles]);

  const filtered = useMemo(
    () => (active === 'Tous' ? articles : articles.filter((a) => a.category === active)),
    [articles, active],
  );

  return (
    <div className="font-[family-name:var(--font-inter)]">
      <div className="mb-10 inline-flex flex-wrap gap-1 rounded-xl p-1" style={{ background: '#E6EAF1' }} role="group" aria-label="Filtrer par sujet">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className="rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors [@media(pointer:coarse)]:min-h-11"
              style={isActive ? { background: '#FFFFFF', color: INK, boxShadow: '0 1px 2px rgba(19,33,61,0.12)' } : { color: INK_SOFT }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.map((article) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(19,33,61,0.07),0_10px_24px_rgba(19,33,61,0.05)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(19,33,61,0.09),0_18px_36px_rgba(19,33,61,0.09)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex flex-wrap items-center gap-2 text-[13px]" style={{ color: INK_SOFT }}>
                {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                {article.category && <span className={sections.pill}>{article.category}</span>}
              </span>
              <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4" style={{ color: INK }}>
                {article.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed" style={{ color: INK_SOFT }}>
                {article.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[14.5px] font-semibold" style={{ color: '#1E3A66' }}>
                Lire l'article
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
