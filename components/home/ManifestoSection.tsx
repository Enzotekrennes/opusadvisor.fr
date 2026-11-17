import React from 'react';

const NAVY = '#1A2332';
const PAPER = '#FAF7F0';
const RULE = 'rgba(26,35,50,0.16)';

const rules = [
  {
    title: "Vous comprenez tout ce qu'on installe.",
    desc: "On forme votre équipe et on vous laisse la documentation. Si on arrête de travailler ensemble, votre système continue de tourner.",
  },
  {
    title: "On ne touche rien sur les logiciels qu'on recommande.",
    desc: "Aucune commission d'éditeur. On vous conseille l'outil qui vous convient, et c'est souvent celui que vous avez déjà.",
  },
  {
    title: 'On chiffre le gain avant de commencer.',
    desc: 'Si on ne peut pas montrer ce que ça vous rapporte, on ne vous le vend pas.',
  },
  {
    title: 'Si on ne vous sert à rien, on vous le dit.',
    desc: "Certaines boîtes n'ont pas besoin de nous. Dans ce cas, on vous oriente vers quelqu'un d'autre.",
  },
];

/** Who the visitor will deal with: the founder's signed letter, then the four rules that bind the work. */
export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32" style={{ background: PAPER }} aria-labelledby="manifeste-title">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Signed letter next to a real portrait: the visitor is buying time with this person. */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start">
          <figure className="md:col-span-4 flex md:block items-center gap-5">
            <img
              src="/images/enzo.jpg"
              alt="Enzo Monnier, fondateur d'Opus Advisor"
              width={520}
              height={520}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-full object-cover md:h-auto md:w-full md:aspect-square md:rounded-2xl"
            />
            <figcaption className="md:mt-5">
              <p className="font-semibold" style={{ color: NAVY }}>
                Enzo Monnier
              </p>
              <p className="text-sm text-gray-600">Fondateur, ancien développeur</p>
            </figcaption>
          </figure>

          <div className="md:col-span-8">
            <h2
              id="manifeste-title"
              className="font-heading font-bold leading-tight tracking-tight text-3xl md:text-4xl"
              style={{ color: NAVY }}
            >
              Pourquoi on a monté Opus Advisor
            </h2>

            <div className="mt-8 space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>
                Les éditeurs de logiciels vendent leur outil, puis passent à l'entreprise suivante. Les
                cabinets de conseil livrent une feuille de route, et c'est au dirigeant de l'appliquer seul,
                le soir, après sa journée.
              </p>
              <p>
                Entre les deux, personne ne branche les outils entre eux, et personne ne reste ensuite
                pour les faire tourner. C'est ce qu'on fait.
              </p>
              <p>
                L'objectif : vous rendre 10 heures par semaine une fois votre système en place. On les mesure
                avec vous, sur vos chiffres.
              </p>
            </div>
          </div>
        </div>

        <h3
          data-reveal
          className="mt-20 md:mt-24 font-heading font-bold leading-tight tracking-tight text-2xl md:text-3xl"
          style={{ color: NAVY }}
        >
          Quatre règles qu'on s'impose
        </h3>
        <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-14">
          {rules.map((r, i) => (
            <li key={r.title} data-reveal data-reveal-delay={String((i % 2) + 1)} className="py-7 border-t" style={{ borderColor: RULE }}>
              <h4 className="font-heading font-semibold text-xl leading-snug" style={{ color: NAVY }}>
                {r.title}
              </h4>
              <p className="mt-3 text-base text-gray-700 leading-relaxed">{r.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
