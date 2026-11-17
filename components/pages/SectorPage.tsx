import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AutomationDemo } from '@/components/motion/AutomationDemo';
import { PageHero, HeroActions } from '@/components/sections/PageHero';
import { PointsPanel } from '@/components/sections/PointsPanel';
import { SetupWindow } from '@/components/sections/SetupWindow';
import { CaseStories } from '@/components/sections/CaseStories';
import { HomeMethod } from '@/components/sections/HomeMethod';
import { HomeClose } from '@/components/sections/HomeClose';
import { Section, SectionHead } from '@/components/sections/Section';
import { LinkCards } from '@/components/sections/LinkCards';
import { getAllArticles } from '@/lib/articles';
import type { ClientCase } from '@/lib/cases';
import type { DemoKey } from '@/lib/demoFlows';
import type { DesktopIcon } from '@/lib/homeDesktop';

/** The sector's icon, the same as in the home page's Dock, from the demo it shows. */
const DEMO_ICONS: Record<DemoKey, DesktopIcon> = { formation: 'formation', conciergerie: 'conciergerie', agence: 'conciergerie', btp: 'btp' };

export interface SectorPageProps {
  url: string;
  breadcrumbName: string;
  kicker: string;
  title: string;
  intro: string;
  painsTitle: string;
  pains: { title: string; desc: string }[];
  setupTitle: string;
  setup: { what: string; tools?: string; desc: string }[];
  cases: ClientCase[];
  demo: DemoKey[];
  ctaTitle: string;
  ctaText: string;
  /** Articles mis en avant, dans l'ordre d'affichage. Sans article, la section n'apparaît pas. */
  reading?: { title: string; slugs: string[] };
}

/**
 * Template of the /secteurs/* pages (BTP has its own page): the sector's hero with its example flow,
 * its pains, what is set up, its missions, the method and prices, articles to read, and the close.
 */
export const SectorPage: React.FC<SectorPageProps> = (p) => {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Secteurs', item: 'https://opusadvisor.fr/secteurs/' },
      { '@type': 'ListItem', position: 3, name: p.breadcrumbName, item: p.url },
    ],
  };

  const readingArticles = (p.reading?.slugs ?? [])
    .map((slug) => getAllArticles().find((a) => a.slug === slug))
    .filter((a) => a !== undefined);

  const hasCases = p.cases.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="sector-title"
          back={{ href: '/secteurs/', label: 'Tous les secteurs' }}
          chips={[{ label: p.kicker, icon: DEMO_ICONS[p.demo[0]] }]}
          title={p.title}
          lede={p.intro}
          aside={<AutomationDemo keys={p.demo} />}
        >
          <HeroActions />
        </PageHero>

        <PointsPanel id="pains-title" title={p.painsTitle} items={p.pains} tone="ground" />

        <SetupWindow id="setup-title" title={p.setupTitle} windowTitle="Votre système" items={p.setup} tone="white" />

        {hasCases && (
          <CaseStories
            id="sector-cases-title"
            title={p.cases.length > 1 ? 'Ce qu’on a déjà mis en place dans ce secteur' : 'Une mission dans ce secteur'}
            cases={p.cases}
            link={{ href: '/cas-clients', label: 'Tous les cas clients' }}
            tone="ground"
          />
        )}

        <HomeMethod tone={hasCases ? 'white' : 'ground'} />

        {readingArticles.length > 0 && (
          <Section tone={hasCases ? 'ground' : 'white'} labelledBy="reading-title">
            <SectionHead id="reading-title" title={p.reading?.title} />
            <LinkCards items={readingArticles.map((a) => ({ href: `/articles/${a.slug}/`, title: a.title, text: a.description }))} />
          </Section>
        )}

        <HomeClose title={p.ctaTitle} lede={p.ctaText} auditStack={false} />
      </main>
      <Footer />
    </div>
  );
};
