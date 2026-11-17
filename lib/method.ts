/**
 * The four steps of a mission and their public prices, as on the Services page. Shown on the home page
 * and the sector pages: prices up front reassure more than a speech. The Audit Stack is a standalone
 * written review, not a step, and is mentioned apart from this list.
 */
export interface MethodStep {
  name: string;
  price: string;
  line: string;
}

export const methodSteps: MethodStep[] = [
  { name: 'Pré-audit', price: 'Gratuit', line: '30 minutes en visio pour repérer 3 points de friction dans vos outils.' },
  { name: 'Diagnostic', price: '2 500 €', line: '2 à 3 semaines. Un plan chiffré, avec le gain attendu.' },
  { name: 'Mise en œuvre', price: 'Dès 5 500 €', line: '4 à 10 semaines pour installer le système et former votre équipe.' },
  { name: 'Gardien du système', price: '400 à 1 500 €/mois', line: "On surveille le système et on l'adapte quand votre boîte change." },
];
