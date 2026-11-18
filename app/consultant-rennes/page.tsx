import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HardHat } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero, HeroActions } from '@/components/sections/PageHero';
import { Section, SectionHead } from '@/components/sections/Section';
import { PointsPanel } from '@/components/sections/PointsPanel';
import { WindowCards } from '@/components/sections/WindowCards';
import { Window } from '@/components/sections/Window';
import { HomeFaq } from '@/components/sections/HomeFaq';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';

const SITE_URL = 'https://opusadvisor.fr';
const PAGE_URL = `${SITE_URL}/consultant-rennes/`;
const PAGE_TITLE = 'Consultant automatisation et organisation à Rennes';
const PAGE_DESCRIPTION =
  "À Rennes, Opus Advisor construit des systèmes de gestion automatisés pour la formation, l'immobilier et le BTP, en Ille-et-Vilaine et autour. Pré-audit gratuit.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: 'website', images: [{ url: `${SITE_URL}/images/Logo_1200x630.png` }] },
};

const zones = [
  {
    label: "À moins de deux heures de Rennes",
    text: "De Saint-Malo à Nantes, de Vannes à Laval, en passant par Vitré, Fougères, Redon ou Saint-Brieuc. Pendant une mission, on vient sur place voir comment tourne votre bureau.",
  },
  {
    label: 'Ailleurs en France',
    text: 'Le pré-audit se fait en visio, avec vos outils en partage d’écran. Pour la suite, on regarde ensemble ce qui peut se faire à distance.',
  },
];

const topics = [
  {
    title: "Les dossiers d'un organisme de formation",
    text: 'Conventions, convocations et dossiers pour les financeurs générés et envoyés automatiquement.',
    href: '/secteurs/formation/',
    link: 'Organismes de formation',
  },
  {
    title: 'La facturation des propriétaires d’une conciergerie',
    text: 'Un seul traitement pour tous les propriétaires, des plannings de ménage qui suivent les réservations.',
    href: '/secteurs/immobilier/',
    link: 'Immobilier et conciergerie',
  },
  {
    title: 'Le suivi d’une équipe d’agents immobiliers',
    text: 'Les dossiers de chaque agent, l’état de chaque bien et l’avancement des ventes, au même endroit.',
    href: '/cas-clients/',
    link: 'Le cas client',
  },
  {
    title: 'Les devis, situations et relances dans le BTP',
    text: 'Des relances qui partent seules, des situations envoyées à date, la marge suivie chantier par chantier.',
    href: '/secteurs/btp/',
    link: 'BTP second œuvre',
  },
];

const faq = [
  {
    q: 'Vous travaillez seulement autour de Rennes ?',
    a: "Non. On est installés à Vannes et on se déplace pendant les missions dans un rayon d'environ deux heures, en Bretagne et en Pays-de-la-Loire. Ailleurs en France, le pré-audit se fait en visio et on voit ensemble la suite.",
  },
  {
    q: 'Vous vendez un logiciel ?',
    a: 'Non, on ne revend aucun logiciel. On construit le système dont vous avez besoin : des automatisations sur vos outils actuels, une application centrale qui les réunit, ou un système complet si vous partez de zéro. Tout est à votre nom.',
  },
  {
    q: 'Combien ça coûte ?',
    a: "Le pré-audit de 30 minutes est gratuit. L'Audit Stack coûte 990 €, le diagnostic opérationnel 2 500 €, et la mise en œuvre part de 5 500 €. Les prix sont fixes et détaillés sur la page Services.",
  },
];

export default function ConsultantRennesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Consultant à Rennes', item: PAGE_URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Organisation et automatisation de la gestion des petites entreprises',
      url: PAGE_URL,
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'Organisation et automatisation de la gestion',
      areaServed: [
        { '@type': 'City', name: 'Rennes' },
        { '@type': 'AdministrativeArea', name: 'Ille-et-Vilaine' },
        { '@type': 'AdministrativeArea', name: 'Bretagne' },
        { '@type': 'AdministrativeArea', name: 'Pays de la Loire' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="rennes-title"
          chips={[{ label: 'Rennes · Ille-et-Vilaine' }]}
          title="Consultant en organisation et automatisation, à Rennes"
          lede="Opus Advisor est installé à Vannes. On construit pour les petites entreprises de la région des systèmes de gestion complets et automatisés : organismes de formation, conciergeries et agences immobilières, entreprises du BTP."
        >
          <HeroActions />
        </PageHero>

        <PointsPanel id="zone-titre" title="Où on intervient" items={zones.map((z) => ({ title: z.label, desc: z.text }))} tone="ground" />

        <Section tone="white" labelledBy="sujets-titre">
          <SectionHead
            id="sujets-titre"
            title="Ce qu'on règle le plus souvent"
            lede="Selon le secteur, ce sont surtout ces sujets-là. Le point commun : des informations ressaisies dans plusieurs outils, et un administratif qui déborde."
          />
          <WindowCards items={topics.map((t) => ({ key: t.title, label: t.link, title: t.title, text: t.text, href: t.href }))} />
        </Section>

        <Section tone="ground" labelledBy="pilotes-titre">
          <div data-reveal>
            <Window title="Opus Pilotes">
              <div className={inner.announce}>
                <span className={inner.announceIcon} aria-hidden="true">
                  <HardHat size={26} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 id="pilotes-titre" className={sections.subtitle}>
                    Trois places pour le BTP en Bretagne et Pays-de-la-Loire
                  </h2>
                  <p className={inner.announceText}>
                    Pour le bâtiment, on met en place le système complet chez trois entreprises du second œuvre de la région, à 40 %
                    de moins que le tarif habituel. En échange, on publie le cas au bout de six mois, chiffres à l'appui. On vient sur
                    site au moins deux fois pendant la mission.
                  </p>
                  <Link href="/cas-clients#programme-pilote" className={`${sections.more} mt-4`}>
                    Les conditions du programme
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Window>
          </div>
        </Section>

        <HomeFaq items={faq.map((item) => ({ question: item.q, answer: item.a }))} title="Questions fréquentes" tone="white" />

        <HomeClose
          title="30 minutes en visio, sur vos propres outils"
          lede="Vous partagez votre écran, on repère trois points qui vous font perdre du temps et on vous montre comment les régler. Si ça ne vaut pas le coup d'aller plus loin, on vous le dit."
          auditStack={false}
        />
      </main>
      <Footer />
    </div>
  );
}
