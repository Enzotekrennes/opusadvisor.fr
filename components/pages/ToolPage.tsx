import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrackFirstUse } from '@/components/analytics/TrackFirstUse';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import { HomeClose } from '@/components/sections/HomeClose';

const INK = '#13213D';
const NAVY = '#1E3A66';
const RULE = '#E6EAF1';

/** A cell that holds only a figure (« 139,4 », « +8,6 % », « 2 800 € ») stays on one line on a phone. */
const NUMBER = /^[\s+\-\u2212\d,.\u00a0\u202f%\u20ac]+$/;

interface ToolPageProps {
  url: string;
  breadcrumbName: string;
  title: string;
  intro: string;
  calculator: React.ReactNode;
  children: React.ReactNode;
  ctaTitle: string;
  ctaText: string;
}

/**
 * Template of the /outils/* pages: the calculator in a window right under the hero, the explanations
 * below (readable without JavaScript), then the close at dusk with the tool's own invitation.
 */
export const ToolPage: React.FC<ToolPageProps> = ({ url, breadcrumbName, title, intro, calculator, children, ctaTitle, ctaText }) => {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://opusadvisor.fr/outils/' },
      { '@type': 'ListItem', position: 3, name: breadcrumbName, item: url },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero titleId="tool-title" back={{ href: '/outils/', label: 'Tous les outils' }} title={title} lede={intro} />
        <Section tone="ground">
          <ToolWindow name={breadcrumbName}>{calculator}</ToolWindow>
        </Section>
        <Section tone="white" narrow>
          <div className="font-[family-name:var(--font-inter)]">{children}</div>
        </Section>
        <HomeClose title={ctaTitle} lede={ctaText} auditStack={false} />
      </main>
      <Footer />
    </div>
  );
};

/** A calculator in its window, counted once in the audience statistics when first used. */
export const ToolWindow: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => (
  <Window title={name}>
    <div className="p-5 md:p-8">
      <TrackFirstUse tool={name}>{children}</TrackFirstUse>
    </div>
  </Window>
);

/** Sous-titre de section dans les explications d'un outil. */
export const ToolH2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-14 mb-5 text-2xl font-bold leading-tight tracking-tight first:mt-0 md:text-3xl" style={{ color: INK }}>
    {children}
  </h2>
);

export const ToolP: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-5 text-lg leading-relaxed text-[#3C4866]">{children}</p>
);

/** Formule mise en avant (ex. « pénalités = montant × taux × jours ÷ 365 »). */
export const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="my-6 rounded-xl px-5 py-4 text-base font-semibold md:text-lg" style={{ background: '#F3F5F9', color: INK }}>
    {children}
  </p>
);

export const ToolLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="font-semibold underline underline-offset-4 decoration-[#1E3A66]/35 hover:decoration-[#1E3A66]" style={{ color: NAVY }}>
    {children}
  </Link>
);

export const ToolTable: React.FC<{ head: string[]; rows: string[][] }> = ({ head, rows }) => (
  <div className="my-6 overflow-x-auto">
    <table className="w-full border-collapse text-left text-base tabular-nums">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="border-b py-3 pr-4 text-[13.5px] font-semibold text-[#56627E]" style={{ borderColor: '#DDE3EC' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.join('|')}>
            {r.map((c, i) => (
              <td key={i} className={`border-b py-3 pr-4 text-[#3C4866] ${NUMBER.test(c) ? 'whitespace-nowrap' : ''}`} style={{ borderColor: RULE }}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
