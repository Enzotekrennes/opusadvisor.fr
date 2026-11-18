'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionHead } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import { PointsPanel } from '@/components/sections/PointsPanel';
import { WindowCards } from '@/components/sections/WindowCards';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';

interface ServiceData {
  id: string;
  tag: string;
  title: string;
  hook: string;
  description: string;
  deliverables: string[];
  price: string;
  priceNote?: string;
  duration: string;
  cta?: string;
}

const services: ServiceData[] = [
  {
    id: 'pre-audit',
    tag: 'Sans engagement',
    title: 'Pré-audit gratuit',
    hook: 'Vous voyez ce que ça donne avant de décider quoi que ce soit.',
    description:
      "30 minutes en visio. Vous partagez votre écran et vous me montrez vos outils. Je repère 3 points de friction dans votre boîte et je vous montre en direct comment les régler. On travaille sur vos vrais outils, sans présentation.",
    deliverables: [
      'Un tour rapide de vos outils actuels',
      '3 points de friction repérés en direct',
      '1 automatisation montrée sur vos propres données',
      'Une recommandation honnête : continuer ou en rester là',
    ],
    price: 'Gratuit',
    duration: '30 min · Visio',
    cta: 'Réserver le pré-audit gratuit',
  },
  {
    id: 'audit-stack',
    tag: 'Indépendant de tout éditeur',
    title: 'Audit Stack',
    hook: '990 €, 10 jours, et vous savez où vous en êtes.',
    description:
      "On cartographie vos outils et on repère les points de friction. Pour chaque outil, vous recevez une recommandation claire : l'ajouter, le remplacer ou le relier aux autres. Vous savez aussi de quel système vous avez besoin : des automatisations, une application centrale ou un système complet. On ne revend aucun logiciel, donc on n'a aucun intérêt à vous en placer un.",
    deliverables: [
      'La carte complète de vos outils actuels',
      'Les points de friction, par ordre de priorité',
      'Une recommandation pour chaque outil : ajouter, remplacer ou relier',
      'Le coût estimé de chaque chantier à mener',
    ],
    price: '990 €',
    priceNote: 'TVA non applicable · art. 293 B CGI',
    duration: '10 jours ouvrés',
    cta: 'Demander un Audit Stack',
  },
  {
    id: 'diagnostic',
    tag: 'Prix fixe',
    title: 'Diagnostic opérationnel',
    hook: 'On cartographie votre boîte et on chiffre ce que vous allez gagner.',
    description:
      "Deux à trois semaines pour comprendre comment tourne votre boîte : entretiens avec l'équipe, circuit des devis et des factures, outils en place. Vous recevez un plan précis et chiffré, avec le gain attendu. Si vous voulez qu'on l'applique, on s'en charge. Sinon, le plan vous appartient.",
    deliverables: [
      "La carte complète de l'existant",
      'Les 5 à 10 chantiers prioritaires',
      'La cible à 12 mois',
      "Le plan d'exécution chiffré, coûts et gains estimés",
      'Une restitution en direct avec votre équipe',
    ],
    price: '2 500 €',
    priceNote: 'TVA non applicable · art. 293 B CGI',
    duration: '2 à 3 semaines',
  },
  {
    id: 'implementation',
    tag: 'Un système qui tourne',
    title: 'Mise en œuvre',
    hook: 'On installe le système, puis on forme vos équipes dessus.',
    description:
      "On construit le système défini au diagnostic, à votre image : selon les cas, les automatisations seules (Make ou n8n), une application centrale qui réunit vos logiciels (base Airtable ou outil développé pour vous), ou tout le système de A à Z. On teste sur vos vrais dossiers, on forme l'équipe et on vous laisse une documentation écrite.",
    deliverables: [
      "L'application centrale, si le diagnostic la prévoit",
      'Votre logiciel métier paramétré et exploité à fond',
      'Les automatisations en service : relances, rapports, synchronisations',
      'Les documents partagés, au même endroit pour toute l’équipe',
      "La formation de l'équipe, en français, sur vos données",
      'La documentation et les schémas du système',
    ],
    price: 'À partir de 5 500 €',
    priceNote: 'Selon le périmètre · chiffré précisément après le diagnostic',
    duration: '4 à 10 semaines',
  },
  {
    id: 'suivi',
    tag: 'Optionnel',
    title: 'Gardien du système',
    hook: 'Votre système suit les changements de votre boîte.',
    description:
      "Quelqu'un qui connaît votre système reste disponible. On fait un point chaque mois, on surveille les automatisations, on répare si quelque chose casse et on ajoute ce qui manque au fil de l'eau. Vous m'écrivez directement, sans ticket ni centre d'appel.",
    deliverables: [
      'La surveillance des automatisations, avec une alerte en cas de panne',
      'Un point par mois, en visio de 30 minutes ou par écrit',
      "2 à 4 heures d'évolutions comprises chaque mois",
      'Un accès direct par mail et WhatsApp',
      'La documentation tenue à jour',
    ],
    price: '400 à 1 500 €/mois',
    priceNote: 'Selon la taille du système · sans engagement (formule Premium : engagement de 12 mois)',
    duration: 'Mensuel',
  },
];

const comparisons = [
  {
    vs: 'Face à un éditeur de logiciel',
    text: "Un éditeur vend le même outil à tout le monde, puis passe à l'entreprise suivante. On ne revend aucun logiciel : on construit un système à votre image, qui reprend vos logiciels quand ils font l'affaire.",
  },
  {
    vs: 'Face à un cabinet de conseil',
    text: "Un cabinet livre une feuille de route et vous laisse l'appliquer. On l'applique avec vous, jusqu'à ce que le système tourne dans votre boîte.",
  },
  {
    vs: 'Face à un freelance Make ou Zapier',
    text: 'Un freelance facture des journées. On livre un système complet, avec sa documentation et la formation de vos équipes, puis le Gardien à partir de 400 €/mois si quelque chose casse.',
  },
  {
    vs: 'Face à un programme France Num gratuit',
    text: 'Un programme financé accompagne 1 500 entreprises avec la même méthode. On part de vos outils et de la façon dont votre boîte tourne vraiment.',
  },
];

const summary = [
  'Des missions réelles en formation et en immobilier, des outils dédiés au BTP',
  'Un système à votre image, des automatisations au système complet',
  'On reste après la mise en œuvre, avec le Gardien',
  'On mesure le temps gagné, sur vos chiffres',
  'Indépendants de tous les éditeurs de logiciels',
  'Les automatisations tournent chez vous dès la mise en œuvre',
];

/** The four steps of a mission, in order; the Audit Stack is a standalone written review beside them. */
const STEPS = services.filter((s) => s.id !== 'audit-stack');
const ALTERNATIVE = services.find((s) => s.id === 'audit-stack') as ServiceData;

/** Height to leave above a section reached by its anchor, for the fixed menu bar. */
const BAR_OFFSET = 80;

/** The four steps and the Audit Stack with their prices, linking to each offer below: shown beside the hero. */
const PriceList: React.FC = () => (
  <Window title="Tarifs">
    <ul className={inner.priceList}>
      {[...STEPS, ALTERNATIVE].map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`}>
            <b>{s.title}</b>
            <em>{s.price}</em>
            <small>{s.duration}</small>
          </a>
        </li>
      ))}
    </ul>
  </Window>
);

/** One offer in its window: tag, name, promise and price on the left, what it is and what you receive on the right. */
const OfferBody: React.FC<{ s: ServiceData }> = ({ s }) => (
  <div className={inner.offerBody}>
    <div>
      <span className={sections.pill}>{s.tag}</span>
      <h3 className={inner.offerTitle}>{s.title}</h3>
      <p className={inner.offerHook}>{s.hook}</p>
      <p className={inner.offerPrice}>
        <small>{s.duration}</small>
        <b>{s.price}</b>
        {s.priceNote && <span>{s.priceNote}</span>}
      </p>
    </div>
    <div>
      <p className={inner.offerText}>{s.description}</p>
      <p className={inner.offerListTitle}>Ce que vous recevez</p>
      <ul className={inner.ticks}>
        {s.deliverables.map((d) => (
          <li key={d}>
            <Check size={16} strokeWidth={2.6} aria-hidden="true" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      {s.cta && (
        <p className={inner.offerCta}>
          <Link href="/contact" className={sections.button}>
            {s.cta}
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
        </p>
      )}
    </div>
  </div>
);

/**
 * Services page: the four steps with their prices and the Audit Stack apart, how they compare with the other options, a short
 * summary, two links to go further, and the close. An anchor in the address (#diagnostic…) scrolls to
 * its offer once the page is loaded.
 */
export const ServicesView: React.FC = () => {
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    const element = id ? document.getElementById(id) : null;
    if (!element) return;
    const timer = setTimeout(() => {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - BAR_OFFSET, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main id="contenu" className="flex-grow">
      <PageHero
        titleId="services-title"
        title="Quatre étapes, avec leur prix."
        lede="Vous connaissez le prix de chaque étape avant de signer, et vous pouvez vous arrêter à la fin de chacune."
        aside={<PriceList />}
      />

      <Section tone="ground" labelledBy="offers-title">
        <h2 id="offers-title" className="sr-only">
          Les quatre étapes
        </h2>
        <ol className={inner.offers}>
          {STEPS.map((s, i) => (
            <li key={s.id} id={s.id} className={inner.offer} data-reveal>
              <Window title={`Étape ${i + 1} sur ${STEPS.length}`}>
                <OfferBody s={s} />
              </Window>
            </li>
          ))}
        </ol>
        {/* Not a step: a written review on its own, for those who only want an outside opinion on their tools. */}
        <div id={ALTERNATIVE.id} className={`${inner.offer} mt-7`} data-reveal>
          <Window title="En alternative">
            <OfferBody s={ALTERNATIVE} />
          </Window>
        </div>
      </Section>

      <PointsPanel
        id="compare-title"
        title="Par rapport aux autres options"
        items={comparisons.map((c) => ({ title: c.vs, desc: c.text }))}
        tone="white"
      />

      <Section id="identite" tone="ground" labelledBy="summary-title">
        <SectionHead id="summary-title" title="En résumé" />
        <ul className={inner.tickPanel} data-reveal data-reveal-delay="1">
          {summary.map((line) => (
            <li key={line}>
              <Check size={18} strokeWidth={2.6} aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" labelledBy="further-title">
        <SectionHead id="further-title" title="Avant de décider, prenez deux minutes" />
        <WindowCards
          items={[
            {
              key: 'pilotes',
              label: 'Programme pilote · 3 places',
              title: 'Opus Pilotes : construisez la première version avec nous',
              text: 'Pour le BTP : trois entreprises du second œuvre, 40 % moins cher que le tarif normal, avec un accès direct. En échange, on documente ensemble ce qui marche.',
              href: '/cas-clients#programme-pilote',
            },
            {
              key: 'articles',
              label: 'Conseils et retours terrain',
              title: 'Nos articles, pour voir comment on travaille',
              text: 'Facturation électronique, relances, marge, outils comparés : des articles courts, écrits d’abord pour les patrons du BTP.',
              href: '/articles',
            },
          ]}
        />
      </Section>

      <HomeClose
        title="Vous hésitez sur l'offre qui colle à votre boîte ?"
        lede="Commencez par le pré-audit. C'est gratuit, ça dure 30 minutes, et vous repartez avec 3 points de friction identifiés. Ensuite, on décide ensemble si on continue."
        auditStack={false}
      />
    </main>
  );
};
