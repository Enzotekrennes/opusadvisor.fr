import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import { LinkCards } from '@/components/sections/LinkCards';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';
import { tools } from '@/lib/tools';

const PAGE_URL = 'https://opusadvisor.fr/outils/';
const PAGE_TITLE = 'Outils gratuits BTP : calculateurs et indice BT01';
const PAGE_DESCRIPTION =
  'Calculateurs gratuits BTP : marge chantier, coût horaire, indice BT01, pénalités de retard, retenue de garantie, situation de travaux. Sans inscription.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: 'website', images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }] },
};

export default function ToolsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
        { '@type': 'ListItem', position: 2, name: 'Outils', item: PAGE_URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: tools.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: `${PAGE_URL}${t.slug}/`,
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="tools-title"
          title="Les calculs qu'on refait sans arrêt au bureau"
          lede="Marge d'un chantier, coût horaire d'un compagnon, révision de prix, pénalités d'une facture en retard, retenue de garantie, situation de travaux. Chaque outil donne le résultat et explique le calcul. Pas d'inscription, rien n'est enregistré."
        />

        <Section tone="ground">
          <div data-reveal>
            <Window title="Nouveau · facture électronique">
              <Link href="/diagnostic-facture-electronique/" className={`${inner.announce} group text-inherit no-underline`}>
                <span className={inner.announceIcon} aria-hidden="true">
                  <FileCheck2 size={26} strokeWidth={1.8} />
                </span>
                <span>
                  <span className={`${sections.subtitle} block group-hover:underline group-hover:underline-offset-4`}>
                    Facture électronique : où en est votre entreprise ?
                  </span>
                  <span className={`${inner.announceText} block`}>
                    7 questions, 2 minutes : réception, émission, e-reporting, les dates qui vous concernent et ce qu'il reste à
                    faire. Le verdict s'affiche sans laisser votre email.
                  </span>
                  <span className={`${sections.more} mt-4`}>
                    Faire le diagnostic
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Window>
          </div>

          <LinkCards three items={tools.map((tool) => ({ href: `/outils/${tool.slug}/`, title: tool.title, text: tool.description }))} />

          <p className={sections.note}>
            Ces outils donnent un ordre de grandeur fiable pour un devis ou une relance. Pour un litige, faites valider le montant
            par votre comptable ou votre avocat.
          </p>
        </Section>

        <HomeClose />
      </main>
      <Footer />
    </div>
  );
}
