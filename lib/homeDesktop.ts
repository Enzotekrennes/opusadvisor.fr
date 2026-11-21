/**
 * Content of the home page hero, drawn as a desktop: the trades it speaks to, the example window
 * that sends each trade's documents, the notifications that land when they leave, and the Dock.
 * Everything shown in the window and the notifications is fictitious example data, labelled as such
 * on the page. Icons are named here and drawn by the components.
 */

export type DesktopIcon = 'formation' | 'conciergerie' | 'btp' | 'cases' | 'tools' | 'booking';

/** The three trades, shown as links above the headline. */
export const desktopSectors: { icon: DesktopIcon; label: string; href: string }[] = [
  { icon: 'formation', label: 'Organismes de formation', href: '/secteurs/formation' },
  { icon: 'conciergerie', label: 'Immobilier et conciergerie', href: '/secteurs/immobilier' },
  { icon: 'btp', label: 'BTP second œuvre', href: '/secteurs/btp' },
];

/** One trade in the example window: its sidebar entry, its documents and the last one being sent. */
export interface DesktopPanel {
  icon: DesktopIcon;
  sidebar: string;
  /** Header of the middle column: what the documents belong to. */
  subject: string;
  /** Documents already handled: name, what it belongs to, status. */
  rows: [string, string, string][];
  /** The document being sent while the visitor watches: name, what it belongs to, final status. */
  sending: [string, string, string];
}

export const desktopPanels: DesktopPanel[] = [
  {
    icon: 'formation',
    sidebar: 'Formation',
    subject: 'Session',
    rows: [
      ['Convention', 'Gestion de chantier', 'Générée'],
      ['Convocations', 'Gestion de chantier', 'Envoyées'],
      ['Émargements', 'Jour 1 et jour 2', 'Signés'],
    ],
    sending: ['Dossier de financement', 'Pièces jointes', 'Envoyé'],
  },
  {
    icon: 'conciergerie',
    sidebar: 'Conciergerie',
    subject: 'Bien',
    rows: [
      ['Réservations d’octobre', 'Villa des Pins', 'Importées'],
      ['Relevé propriétaire', 'Villa des Pins', 'Calculé'],
      ['Facture propriétaire', 'Studio du port', 'Générée'],
    ],
    sending: ['Envoi au propriétaire', 'Relevé et facture', 'Envoyé'],
  },
  {
    icon: 'btp',
    sidebar: 'BTP',
    subject: 'Chantier',
    rows: [
      ['Devis', 'Salle de bains', 'Signé'],
      ['Situation n° 3', 'Extension maison', 'Envoyée'],
      ['Facture 2026-0142', 'Extension maison', 'Envoyée'],
    ],
    sending: ['Relance J+7', 'Facture 2026-0142', 'Partie'],
  },
];

/** The notification each trade receives when its last document leaves, in the same order as the panels. */
export const desktopNotifications: { icon: DesktopIcon; app: string; title: string; body: string }[] = [
  { icon: 'formation', app: 'Formation', title: 'Dossier de financement envoyé', body: 'Pièces jointes comprises.' },
  { icon: 'conciergerie', app: 'Conciergerie', title: 'Relevé propriétaire envoyé', body: 'Villa des Pins, octobre.' },
  { icon: 'btp', app: 'BTP', title: 'Relance partie', body: 'Facture 2026-0142, échue hier.' },
];

/** Dock entries: the trades, then the ways in. `null` is the separator; `compact` entries stay on phones. */
export const desktopDock: ({ icon: DesktopIcon; label: string; href: string; compact?: boolean; accent?: boolean } | null)[] = [
  { icon: 'formation', label: 'Formation', href: '/secteurs/formation', compact: true },
  { icon: 'conciergerie', label: 'Conciergerie', href: '/secteurs/immobilier', compact: true },
  { icon: 'btp', label: 'BTP', href: '/secteurs/btp', compact: true },
  null,
  { icon: 'cases', label: 'Cas clients', href: '/cas-clients', compact: true },
  { icon: 'tools', label: 'Outils gratuits', href: '/outils' },
  { icon: 'booking', label: 'Pré-audit', href: '/contact', accent: true },
];
