import type { SectorSlug } from './cases';

// Secteurs mis en avant : ceux où l'on a une mission réelle (formation, immobilier)
// et le BTP, pour lequel le site a déjà ses outils et ses articles.
export interface Sector {
  slug: SectorSlug;
  name: string;
  short: string;
  href: string;
  /** Published pilot offer for a sector with no client case yet: said plainly instead of implying past work. */
  pilot?: { text: string; href: string };
}

export const sectors: Sector[] = [
  {
    slug: 'formation',
    name: 'Organismes de formation',
    short: 'Inscriptions, conventions, convocations, émargements, dossiers de financement et preuves Qualiopi.',
    href: '/secteurs/formation/',
  },
  {
    slug: 'immobilier',
    name: 'Immobilier et conciergerie',
    short: 'Réservations, ménages, facturation des propriétaires, suivi des mandats et pilotage des agents.',
    href: '/secteurs/immobilier/',
  },
  {
    slug: 'btp',
    name: 'BTP second œuvre',
    short: 'Devis, situations de travaux, relances, suivi de chantier et révision de prix.',
    href: '/secteurs/btp/',
    pilot: {
      text: "Pas encore de mission BTP à montrer : 3 places pilotes en Bretagne et Pays-de-la-Loire, système complet à tarif pilote.",
      href: '/cas-clients/#programme-pilote',
    },
  },
];
