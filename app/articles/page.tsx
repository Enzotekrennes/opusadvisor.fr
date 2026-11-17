import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { HomeClose } from '@/components/sections/HomeClose';
import { ArticlesGrid } from '@/components/pages/ArticlesGrid';
import { getAllArticles } from '@/lib/articles';

const PAGE_URL = 'https://opusadvisor.fr/articles';
const PAGE_TITLE = 'Articles sur la gestion des entreprises du BTP';
const PAGE_DESCRIPTION =
  "Conseils et retours terrain pour les patrons du BTP second œuvre : consolidation des outils, comparatifs Batappli/Obat/EBP, facturation 2027, automatisations.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['https://opusadvisor.fr/images/Logo_1200x630.png'],
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  const articleListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://opusadvisor.fr/articles/${article.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListJsonLd) }}
      />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="articles-title"
          title="Conseils et retours terrain."
          lede="Méthodes de consolidation, outils BTP comparés, facturation électronique, automatisations testées sur le terrain. Lecture courte, sans jargon."
        />
        <Section tone="ground">
          <ArticlesGrid articles={articles} />
        </Section>
        <HomeClose />
      </main>
      <Footer />
    </div>
  );
}
