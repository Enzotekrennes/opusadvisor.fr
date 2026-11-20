import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Window } from '@/components/sections/Window';
import { HomeClose } from '@/components/sections/HomeClose';
import inner from '@/components/sections/inner.module.css';

interface Bullet {
  title: string;
  desc: string;
}

interface Member {
  name: string;
  role: string;
  photo: string;
  location: string;
  experience: string;
  label: string;
  heading: string;
  bullets: Bullet[];
}

const team: Member[] = [
  {
    name: 'Enzo Monnier',
    role: 'Fondateur · Organisation et automatisation',
    photo: '/images/enzo.jpg',
    location: 'Vannes · Interventions partout en France',
    experience: "5 ans d'études à Epitech · 3 ans de dev avant Opus",
    label: 'Pourquoi Opus Advisor',
    heading: 'Je code encore ce que je déploie chez vous.',
    bullets: [
      {
        title: 'Développeur pendant 3 ans, consultant depuis',
        desc: "Formé à Epitech (5 ans d'études, diplôme d'expert en nouvelles technologies), j'ai développé des logiciels métier pendant 3 ans avant de passer au conseil. Je code moi-même ce que j'installe chez vous : vous n'aurez jamais affaire à un sous-traitant.",
      },
      {
        title: "Ce que j'ai compris en travaillant pour d'autres",
        desc: "Un logiciel bien choisi mais mal installé ne sert à rien. J'ai souvent vu un outil payé 3 000 € par an utilisé à 20 %. Mon travail, c'est que celui que vous avez, ou celui qu'on choisira ensemble, serve vraiment au quotidien.",
      },
      {
        title: 'Pourquoi les petites entreprises',
        desc: "Organisme de formation, conciergerie ou entreprise du bâtiment : à cette taille, le dirigeant est encore sur le terrain et l'administratif se fait le soir. C'est là que les bons outils peuvent rendre 10 heures par semaine, sans embaucher d'assistant.",
      },
    ],
  },
  {
    name: 'Gwendoline',
    role: 'Associée',
    photo: '/images/gwen.jpg',
    location: 'Vannes · Interventions partout en France',
    experience: "5 ans d'études à Epitech · 3 ans de dev avant Opus",
    label: 'Pourquoi une équipe de deux',
    heading: 'Deux personnes sur votre système, un seul interlocuteur.',
    bullets: [
      {
        title: 'Vous gardez un seul contact',
        desc: 'Vous choisissez qui de nous deux vous suit, et vous avez toujours la même personne au téléphone.',
      },
      {
        title: 'On travaille à deux derrière',
        desc: "Chaque décision importante (choix d'un outil, paramétrage, branchement) est discutée entre nous avant de vous être livrée. Concrètement, ça fait moins d'erreurs et moins d'allers-retours.",
      },
      {
        title: 'Ce que ça change pour vous',
        desc: "Seul, un consultant valide vite ses propres choix. À deux, on doit se justifier l'un devant l'autre : chaque décision qui arrive chez vous a été contestée au moins une fois.",
      },
    ],
  },
];

/**
 * Team page: the two partners, one window each (who they are on the left, why they work this way on the
 * right), then the close.
 */
export const TeamView: React.FC = () => (
  <main id="contenu" className="flex-grow">
    <PageHero
      titleId="team-title"
      title="Qui bosse sur votre système."
      lede="Deux associés, anciens développeurs. Un seul interlocuteur par mission."
    />

    <Section tone="ground">
      <ul className={inner.profiles}>
        {team.map((m) => (
          <li key={m.name} data-reveal>
            <Window title={m.label}>
              <div className={inner.profileBody}>
                <div>
                  <img src={m.photo} alt={m.name} width={264} height={264} loading="lazy" className={inner.profilePhoto} />
                  <h2 className={inner.profileName}>{m.name}</h2>
                  <p className={inner.profileRole}>{m.role}</p>
                  <ul className={inner.profileMeta}>
                    <li>
                      <MapPin size={15} aria-hidden="true" />
                      {m.location}
                    </li>
                    <li>
                      <Calendar size={15} aria-hidden="true" />
                      {m.experience}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className={inner.profileHeading}>{m.heading}</h3>
                  <ul className={inner.bullets}>
                    {m.bullets.map((b) => (
                      <li key={b.title}>
                        <h4>{b.title}</h4>
                        <p>{b.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Window>
          </li>
        ))}
      </ul>
    </Section>

    <HomeClose
      title="Un seul interlocuteur, du premier appel jusqu'au système qui tourne."
      lede="La personne qui fait votre pré-audit est celle qui installe votre système, puis celle qui vous répond quand vous avez une question."
      auditStack={false}
    />
  </main>
);
