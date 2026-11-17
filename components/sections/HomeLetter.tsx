import React from 'react';
import { Check } from 'lucide-react';
import { Window } from './Window';
import styles from './sections.module.css';

/** The four rules that bind the work, shown as a ticked list beside the letter. */
const RULES = [
  {
    title: 'Vous comprenez tout ce qu’on installe.',
    desc: 'On forme votre équipe et on vous laisse la documentation. Si on arrête de travailler ensemble, votre système continue de tourner.',
  },
  {
    title: 'On ne touche rien sur les logiciels qu’on recommande.',
    desc: 'Aucune commission d’éditeur. On vous conseille l’outil qui vous convient, et c’est souvent celui que vous avez déjà.',
  },
  {
    title: 'On chiffre le gain avant de commencer.',
    desc: 'Si on ne peut pas montrer ce que ça vous rapporte, on ne vous le vend pas.',
  },
  {
    title: 'Si on ne vous sert à rien, on vous le dit.',
    desc: 'Certaines boîtes n’ont pas besoin de nous. Dans ce cas, on vous oriente vers quelqu’un d’autre.',
  },
];

/**
 * Home page: who the visitor will deal with. The founder's letter, as a message he signed, and beside
 * it the four rules Opus holds itself to, as a ticked list.
 */
export const HomeLetter: React.FC = () => (
  <section className={`${styles.section} ${styles.white}`} aria-labelledby="manifeste-title">
    <div className={`${styles.inner} ${styles.letterGrid}`}>
      <Window title="Message">
        <div className={styles.mailHead} data-reveal>
          <div className={styles.mailFrom}>
            <img src="/images/enzo.jpg" alt="Enzo Monnier, fondateur d'Opus Advisor" width={104} height={104} loading="lazy" />
            <p>
              <b>Enzo Monnier</b>
              <span>Fondateur, ancien développeur</span>
            </p>
          </div>
          <p className={styles.mailTo}>À&nbsp;: vous</p>
          <h2 id="manifeste-title" className={`${styles.subtitle} ${styles.mailSubject}`}>
            Pourquoi on a monté Opus Advisor
          </h2>
        </div>
        <div className={styles.mailBody}>
          <p>
            Les éditeurs de logiciels vendent leur outil, puis passent à l’entreprise suivante. Les cabinets de conseil
            livrent une feuille de route, et c’est au dirigeant de l’appliquer seul, le soir, après sa journée.
          </p>
          <p>
            Entre les deux, personne ne branche les outils entre eux, et personne ne reste ensuite pour les faire
            tourner. C’est ce qu’on fait.
          </p>
          <p>
            L’objectif&#8239;: vous rendre 10&nbsp;heures par semaine une fois votre système en place. On les mesure avec
            vous, sur vos chiffres.
          </p>
          <p className={styles.signature}>Enzo</p>
        </div>
      </Window>

      <Window title="Rappels">
        <div className={styles.rulesHead}>
          <h3 className={styles.subtitle}>Quatre règles qu’on s’impose</h3>
        </div>
        <ul className={styles.rules}>
          {RULES.map((r, i) => (
            <li key={r.title} className={styles.rule} data-reveal data-reveal-delay={String(i + 1)}>
              <span className={styles.check} aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <div>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Window>
    </div>
  </section>
);
