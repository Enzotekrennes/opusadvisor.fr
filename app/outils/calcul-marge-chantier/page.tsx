import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MarginCalculator } from '@/components/pages/MarginCalculator';
import { ToolWindow } from '@/components/pages/ToolPage';
import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHead } from '@/components/sections/Section';
import { SetupWindow } from '@/components/sections/SetupWindow';
import { PointsPanel } from '@/components/sections/PointsPanel';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';


const PAGE_URL = 'https://opusadvisor.fr/outils/calcul-marge-chantier/';
const PAGE_TITLE = 'Calcul de marge chantier BTP : calculateur gratuit';
const PAGE_DESCRIPTION =
  'Calculez la marge d’un chantier BTP : déboursé sec, prix de revient, marge brute, bénéfice et prix de vente conseillé. Gratuit et sans inscription.';

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
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://opusadvisor.fr/outils/' },
    { '@type': 'ListItem', position: 3, name: 'Calcul de marge chantier', item: PAGE_URL },
  ],
};

// Formules, dans l'ordre où on les calcule. Le texte reste dans le HTML pour Google et sans JavaScript.
const formulas = [
  {
    name: 'Déboursé sec',
    formula: "main-d'œuvre + matériaux + sous-traitance + matériel + petites dépenses",
    text: "Tout ce que le chantier vous coûte directement. La main-d'œuvre se calcule en multipliant les heures par le coût horaire chargé (salaire et charges), pas par le salaire net.",
  },
  {
    name: 'Prix de revient',
    formula: 'déboursé sec + frais généraux',
    text: "Les frais généraux, ce sont le loyer, les véhicules, les assurances, le comptable et le temps passé au bureau. On les répartit le plus souvent en pourcentage du déboursé sec.",
  },
  {
    name: 'Marge brute',
    formula: 'prix de vente − déboursé sec',
    text: "Ce qu'il reste une fois le chantier payé. Le taux de marge brute, c'est cette marge divisée par le prix de vente.",
  },
  {
    name: 'Bénéfice net',
    formula: 'prix de vente − prix de revient',
    text: 'Ce que le chantier rapporte vraiment, une fois les frais généraux couverts.',
  },
  {
    name: 'Coefficient de vente',
    formula: 'prix de vente ÷ déboursé sec',
    text: 'Avec un coefficient de 1,28, chaque euro dépensé sur le chantier vous est revendu 1,28 €.',
  },
];

/** Why the real margin of a job is often lower than planned. */
const LEAKS = [
  {
    title: 'Les petites dépenses oubliées',
    desc: 'EPI, petites fournitures, allers-retours au dépôt : cumulées, elles pèsent 5 à 15 % du déboursé sec.',
  },
  {
    title: 'Les heures improductives',
    desc: "Déplacements, attente de matériel, reprises : un compagnon n'est productif que 70 à 75 % du temps payé.",
  },
  {
    title: 'Les avenants jamais facturés',
    desc: 'Le petit travail en plus, fait pour ne pas bloquer le chantier, et qui ne ressort sur aucune facture.',
  },
];

/** Margin calculator page: the calculator in a window, the formulas, a worked example, the usual leaks, the close. */
export default function MarginCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="tool-title"
          back={{ href: '/outils/', label: 'Tous les outils' }}
          title="Calcul de la marge d'un chantier"
          lede="Entrez les chiffres de votre devis : vous obtenez le déboursé sec, la marge brute, le bénéfice net et le prix à pratiquer pour gagner ce que vous visez. Rien n'est enregistré."
        />

        <Section tone="ground">
          <ToolWindow name="Calcul de marge chantier">
            <MarginCalculator />
          </ToolWindow>
        </Section>

        <SetupWindow
          id="formules-title"
          title="Comment calculer la marge d'un chantier"
          windowTitle="Formules"
          items={formulas.map((f) => ({ what: f.name, tools: `= ${f.formula}`, desc: f.text }))}
          tone="white"
        />

        <Section tone="ground" labelledBy="exemple-title" narrow>
          <SectionHead id="exemple-title" title="L'exemple du calculateur, ligne par ligne" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#3C4866]">
            <p>
              Un chantier fictif vendu 18 000 € HT. La main-d'œuvre représente 120 heures à 45 € de l'heure chargée, soit
              5 400 €. On ajoute 6 200 € de matériaux, 1 500 € de sous-traitance, 400 € de location et 600 € de petites
              dépenses : le déboursé sec monte à 14 100 €.
            </p>
            <p>
              La marge brute est de 3 900 €, soit 21,7 % du prix de vente, avec un coefficient de 1,28. Avec 15 % de frais
              généraux sur le déboursé sec (2 115 €), le prix de revient atteint 16 215 €, et le bénéfice net tombe à 1 785 €,
              soit 9,9 %.
            </p>
            <p>
              Il suffit d'environ 1 800 € de dépenses imprévues pour effacer le bénéfice de ce chantier. C'est pour ça qu'une
              marge calculée au devis ne suffit pas : il faut la suivre pendant le chantier.
            </p>
          </div>
        </Section>

        <PointsPanel id="fuites-title" title="Pourquoi la marge réelle est souvent plus basse que prévu" items={LEAKS} tone="white">
          <p className={inner.headLink}>
            <Link href="/articles/marge-chantier-suivi-reel/" className={sections.more}>
              Lire notre article sur la marge réelle des chantiers
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </PointsPanel>

        <HomeClose
          title="Vous voulez connaître la marge réelle de vos chantiers, sans tout recalculer à la main ?"
          lede="On met en place un suivi qui remonte les heures, les achats et les avenants chantier par chantier. On en parle pendant le pré-audit : 30 minutes en visio, gratuites."
          auditStack={false}
        />
      </main>
      <Footer />
    </div>
  );
}
