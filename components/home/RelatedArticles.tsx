'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import articlesData from '@/lib/articles.json';
import { tools } from '@/lib/tools';
import { Section, SectionHead } from '@/components/sections/Section';
import { LinkCards } from '@/components/sections/LinkCards';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';

interface RelatedArticlesProps {
  currentArticleId: number;
}

interface ArticleMetadata {
  id: number;
  slug: string;
  title: string;
  description: string;
  publishedAt?: string;
  category?: string;
  related?: string[];
  tools?: string[];
}

/**
 * End of an article: three articles to read next (chosen by topic, then same category, then the most
 * recent), the free tools linked to the article, and a link to every article.
 */
export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentArticleId }) => {
  const all = articlesData as ArticleMetadata[];
  const current = all.find((a) => a.id === currentArticleId);
  // Articles choisis par sujet (champ « related ») ; à défaut, même catégorie, puis les plus récents.
  const picked = (current?.related ?? [])
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is ArticleMetadata => Boolean(a));
  const fallback = all.filter(
    (a) => a.id !== currentArticleId && !picked.includes(a) && a.category === current?.category,
  );
  const rest = all.filter((a) => a.id !== currentArticleId && !picked.includes(a) && !fallback.includes(a));
  const related = [...picked, ...fallback, ...rest].slice(0, 3);
  const relatedTools = (current?.tools ?? [])
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is (typeof tools)[number] => Boolean(t));

  if (related.length === 0) return null;

  return (
    <Section tone="ground" labelledBy="related-title">
      <SectionHead id="related-title" title="À lire aussi" />
      <LinkCards three items={related.map((a) => ({ href: `/articles/${a.slug}/`, title: a.title, text: a.description }))} />

      {relatedTools.length > 0 && (
        <>
          <h3 className={`${sections.subtitle} ${inner.subhead}`}>Outils gratuits liés</h3>
          <LinkCards items={relatedTools.map((t) => ({ href: `/outils/${t.slug}/`, title: t.title, text: t.description }))} />
        </>
      )}

      <p className={inner.headLink}>
        <Link href="/articles" className={sections.more}>
          Voir tous les articles
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </p>
    </Section>
  );
};
