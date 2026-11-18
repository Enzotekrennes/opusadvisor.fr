import type { Metadata } from 'next';
import { MarginCalculator } from '@/components/pages/MarginCalculator';
import { ToolPage, ToolH2, ToolP, Formula, ToolLink } from '@/components/pages/ToolPage';

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

// Formules, dans l'ordre où on les calcule. Le texte reste dans le HTML pour Google et sans JavaScript.
const formulas = [
  {
    name: 'Déboursé sec',
    formula: "main-d'œuvre + matériaux + sous-traitance + matériel + petites dépenses",
    text: (
      <>
        Tout ce que le chantier vous coûte directement. La main-d'œuvre se calcule en multipliant les heures par le{' '}
        <ToolLink href="/outils/calcul-cout-horaire-main-doeuvre/">coût horaire chargé</ToolLink> (salaire et charges), pas
        par le salaire net.
      </>
    ),
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

/**
 * Margin calculator page, on the template of every tool: the calculator in a window under the hero, then
 * the formulas, a worked example and the usual leaks in a reading column, then the close.
 */
export default function MarginCalculatorPage() {
  return (
    <ToolPage
      url={PAGE_URL}
      breadcrumbName="Calcul de marge chantier"
      title="Calcul de la marge d'un chantier"
      intro="Entrez les chiffres de votre devis : vous obtenez le déboursé sec, la marge brute, le bénéfice net et le prix à pratiquer pour gagner ce que vous visez. Rien n'est enregistré."
      calculator={<MarginCalculator />}
      ctaTitle="Vous voulez connaître la marge réelle de vos chantiers, sans tout recalculer à la main ?"
      ctaText="On met en place un suivi qui remonte les heures, les achats et les avenants chantier par chantier. On en parle pendant le pré-audit : 30 minutes en visio, gratuites."
    >
      <ToolH2>Comment calculer la marge d'un chantier</ToolH2>
      {formulas.map((f) => (
        <div key={f.name}>
          <Formula>
            {f.name} = {f.formula}
          </Formula>
          <ToolP>{f.text}</ToolP>
        </div>
      ))}

      <ToolH2>L'exemple du calculateur, ligne par ligne</ToolH2>
      <ToolP>
        Un chantier fictif vendu 18 000 € HT. La main-d'œuvre représente 120 heures à 45 € de l'heure chargée, soit 5 400 €.
        On ajoute 6 200 € de matériaux, 1 500 € de sous-traitance, 400 € de location et 600 € de petites dépenses : le
        déboursé sec monte à 14 100 €.
      </ToolP>
      <ToolP>
        La marge brute est de 3 900 €, soit 21,7 % du prix de vente, avec un coefficient de 1,28. Avec 15 % de frais généraux
        sur le déboursé sec (2 115 €), le prix de revient atteint 16 215 €, et le bénéfice net tombe à 1 785 €, soit 9,9 %.
      </ToolP>
      <ToolP>
        Il suffit d'environ 1 800 € de dépenses imprévues pour effacer le bénéfice de ce chantier. C'est pour ça qu'une marge
        calculée au devis ne suffit pas : il faut la suivre pendant le chantier.
      </ToolP>

      <ToolH2>Pourquoi la marge réelle est souvent plus basse que prévu</ToolH2>
      {LEAKS.map((l) => (
        <ToolP key={l.title}>
          <strong className="font-semibold text-[#13213D]">{l.title}.</strong> {l.desc}
        </ToolP>
      ))}
      <ToolP>
        <ToolLink href="/articles/marge-chantier-suivi-reel/">Lire notre article sur la marge réelle des chantiers</ToolLink>
      </ToolP>
    </ToolPage>
  );
}
