import React from 'react';
import type { Metadata } from 'next';
import { Check, HardHat } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { CaseStories } from '@/components/sections/CaseStories';
import { PointsPanel } from '@/components/sections/PointsPanel';
import { Section, SectionHead } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';
import { cases } from '@/lib/cases';

const PAGE_URL = 'https://opusadvisor.fr/cas-clients';
const PAGE_TITLE = 'Cas clients : formation, conciergerie, immobilier';
const PAGE_DESCRIPTION =
  "Dossiers de financement automatisés, système de gestion d'une conciergerie repris et maintenu, outil de suivi d'agents immobiliers : nos missions réelles.";

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

/** Who the BTP pilot programme is for. */
const profilCriteria = [
  {
    title: 'Métier second œuvre',
    desc: "Électricité, plomberie, chauffage-clim, ou multi-corps d'état.",
  },
  {
    title: '8 à 60+ collaborateurs',
    desc: 'Des artisans structurés aux PME multi-agences. Assez de volume pour que le système ait un impact mesurable.',
  },
  {
    title: 'Bretagne ou Pays-de-la-Loire',
    desc: 'À moins de 2h de Rennes. On vient sur site au moins 2 fois pendant la mission.',
  },
  {
    title: 'Patron disponible',
    desc: "Deux demi-journées sur 6 semaines, bloquées à l'avance. Pas de \"quand j'aurai le temps\".",
  },
];

const dealGive = [
  'Diagnostic complet de votre stack actuelle (valeur 2 500 €)',
  'Mise en œuvre du système : logiciel BTP correctement paramétré, Notion/Drive chantiers, automatisations Make ou n8n',
  'Formation de votre équipe (2 sessions en visio + doc écrite)',
  'Gardien du système pendant 6 mois après la mise en prod',
  'Tarif pilote : 40% de moins que le catalogue standard',
];

const dealTake = [
  "Accès à vos données réelles pendant la mise en œuvre (chiffres, devis, chantiers)",
  'Autorisation de publier un cas détaillé après 6 mois, avec les chiffres avant/après',
  'Un témoignage vidéo de 3 à 5 minutes une fois le système en production (optionnel mais apprécié)',
  'Votre patience : on construit la première version de la méthode Opus avec vous',
];

/** One column of the pilot deal: a window with a ticked list. */
const DealList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <Window>
    <div className={inner.pairBody}>
      <h3>{title}</h3>
      <ul className={inner.ticks}>
        {items.map((d) => (
          <li key={d}>
            <Check size={16} strokeWidth={2.6} aria-hidden="true" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  </Window>
);

/** Cases page: the three real missions told in full, then the BTP pilot programme, then the close. */
export default function CasClientsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="cases-page-title"
          title="Ce qu'on a mis en place chez nos clients."
          lede="Trois missions récentes, dans la formation et l'immobilier. Les noms des clients restent confidentiels ; on peut entrer dans le détail pendant le pré-audit."
        />

        <CaseStories id="stories-title" title="Trois missions, trois problèmes concrets" cases={cases} tone="ground" />

        <Section id="programme-pilote" tone="white" labelledBy="pilot-title">
          <div data-reveal>
            <Window title="Opus Pilotes · BTP">
              <div className={inner.announce}>
                <span className={inner.announceIcon} aria-hidden="true">
                  <HardHat size={26} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 id="pilot-title" className={sections.subtitle}>
                    3 places pour les entreprises du bâtiment.
                  </h2>
                  <p className={inner.announceText}>
                    On n'a pas encore de mission dans le BTP à vous montrer. Plutôt que d'en inventer une, on ouvre 3 places
                    pilotes pour des entreprises du second œuvre en Bretagne et Pays-de-la-Loire : système complet à tarif
                    pilote, et le cas publié après 6 mois.
                  </p>
                </div>
              </div>
            </Window>
          </div>
        </Section>

        <PointsPanel id="profile-title" title="Le programme est pour vous si…" items={profilCriteria} tone="ground" />

        <Section tone="white" labelledBy="deal-title">
          <SectionHead id="deal-title" title="Ce qu'on échange." />
          <div className={inner.pair}>
            <DealList title="Ce qu'on vous donne" items={dealGive} />
            <DealList title="Ce qu'on vous demande" items={dealTake} />
          </div>
        </Section>

        <HomeClose
          title="Un projet ? Tout commence par le pré-audit."
          lede="30 minutes en visio. Vous nous montrez vos outils et votre contexte. Pour une entreprise du bâtiment qui correspond au programme pilote, on vous envoie une proposition chiffrée sous 72 h."
          auditStack={false}
        />
      </main>
      <Footer />
    </div>
  );
}
