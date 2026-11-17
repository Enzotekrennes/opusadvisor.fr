'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';
import { Window } from './Window';
import styles from './sections.module.css';

/** Weeks worked in a year, once holidays and bank holidays are taken out. */
const WEEKS = 45;
/** Hours in a working day, to turn yearly hours into days. */
const DAY_HOURS = 7;

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');

/** One setting of the calculator: a labelled slider with its current value. */
const Setting: React.FC<{
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (n: number) => void;
}> = ({ id, label, value, min, max, unit, onChange }) => (
  <div className={styles.setting}>
    <div className={styles.settingHead}>
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>
        {value} {unit}
      </output>
    </div>
    <input id={id} type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

/**
 * Home page: how many paid hours go into re-typing, from the visitor's own figures, in a settings window.
 * The starting values and their result are in the static page, so it reads without JavaScript; nothing
 * is stored. The first change is counted once in the audience statistics.
 */
export const HomeTimeLoss: React.FC = () => {
  const [hours, setHours] = useState(6);
  const [people, setPeople] = useState(2);
  const [rate, setRate] = useState(35);
  const [used, setUsed] = useState(false);

  /** Applies a change and counts the calculator as used, once. */
  const change = (set: (n: number) => void) => (n: number) => {
    set(n);
    if (used) return;
    setUsed(true);
    track('Calculateur utilisé', { outil: 'Heures de ressaisie (accueil)' });
  };

  const yearly = hours * people * WEEKS;

  return (
    <section className={`${styles.section} ${styles.ground}`} aria-labelledby="timeloss-title">
      <div className={`${styles.inner} ${styles.calcGrid}`}>
        <div className={styles.calcHead} data-reveal>
          <h2 id="timeloss-title" className={styles.title}>
            Combien d’heures partent dans la ressaisie&#8239;?
          </h2>
          <p className={styles.lede}>
            Recopier une inscription, refaire une facture, relancer un client à la main&#8239;: faites le calcul pour votre
            entreprise. Rien n’est enregistré.
          </p>
        </div>

        {/* On phones the calculator comes before the booking button; side by side from 1000 px. */}
        <div className={styles.calcAction}>
          <Link href="/contact" className={styles.button}>
            Réserver le pré-audit gratuit
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
          <p className={`${styles.fine} mt-4`}>Le pré-audit gratuit repère, sur vos outils, les tâches qui peuvent partir seules.</p>
        </div>

        <div className={styles.calcWindow} data-reveal data-reveal-delay="2">
          <Window title="Temps de ressaisie">
            <div className={styles.settings}>
              <Setting id="tl-hours" label="Heures par semaine et par personne" value={hours} min={1} max={20} unit="h" onChange={change(setHours)} />
              <Setting
                id="tl-people"
                label="Personnes concernées"
                value={people}
                min={1}
                max={10}
                unit={people > 1 ? 'personnes' : 'personne'}
                onChange={change(setPeople)}
              />
              <Setting id="tl-rate" label="Coût horaire chargé (salaire et charges)" value={rate} min={15} max={80} unit="€" onChange={change(setRate)} />
            </div>
            <div className={styles.result} aria-live="polite">
              <p className={styles.resultLabel}>Chaque année, sur {WEEKS} semaines travaillées</p>
              <p className={styles.resultHours}>{fmt(yearly)} h</p>
              <p className={styles.resultDays}>soit {fmt(yearly / DAY_HOURS)} jours de travail</p>
              <p className={styles.resultCost}>
                <span className={styles.resultLabel}>Temps payé passé à ressaisir</span>
                <b>{fmt(yearly * rate)} €</b>
              </p>
            </div>
          </Window>
          <p className={`${styles.fine} mt-3`}>Estimation indicative, à partir de vos propres chiffres.</p>
        </div>
      </div>
    </section>
  );
};
