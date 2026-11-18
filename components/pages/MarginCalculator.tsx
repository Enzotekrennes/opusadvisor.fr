'use client';

import React, { useState } from 'react';

const INK = '#13213D';
const ACCENT = '#1E3A66';

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const pct = (v: number) => `${(Math.round(v * 10) / 10).toLocaleString('fr-FR')} %`;

interface Field {
  key: keyof Values;
  label: string;
  hint?: string;
  unit: string;
  step: number;
}

interface Values {
  price: number;
  hours: number;
  hourlyCost: number;
  materials: number;
  subcontracting: number;
  equipment: number;
  misc: number;
  overheadRate: number;
  targetRate: number;
}

// Exemple de départ : un chantier fictif, pour que le calcul ait du sens dès l'affichage.
const DEFAULTS: Values = {
  price: 18000,
  hours: 120,
  hourlyCost: 45,
  materials: 6200,
  subcontracting: 1500,
  equipment: 400,
  misc: 600,
  overheadRate: 15,
  targetRate: 10,
};

const FIELDS: Field[] = [
  { key: 'price', label: 'Prix de vente du chantier', hint: 'Montant HT du devis', unit: '€ HT', step: 100 },
  { key: 'hours', label: "Heures de main-d'œuvre", hint: 'Heures prévues sur le chantier', unit: 'h', step: 1 },
  { key: 'hourlyCost', label: 'Coût horaire chargé', hint: 'Salaire et charges, par heure', unit: '€/h', step: 1 },
  { key: 'materials', label: 'Matériaux et fournitures', unit: '€ HT', step: 50 },
  { key: 'subcontracting', label: 'Sous-traitance', unit: '€ HT', step: 50 },
  { key: 'equipment', label: 'Matériel et location', unit: '€ HT', step: 50 },
  { key: 'misc', label: 'Petites dépenses', hint: 'Déplacements, EPI, évacuation, nettoyage', unit: '€ HT', step: 50 },
  { key: 'overheadRate', label: 'Frais généraux', hint: 'En % du déboursé sec', unit: '%', step: 1 },
  { key: 'targetRate', label: 'Bénéfice visé', hint: 'En % du prix de vente', unit: '%', step: 1 },
];

export const MarginCalculator: React.FC = () => {
  const [v, setV] = useState<Values>(DEFAULTS);

  const labour = v.hours * v.hourlyCost;
  const directCost = labour + v.materials + v.subcontracting + v.equipment + v.misc;
  const overhead = directCost * (v.overheadRate / 100);
  const costPrice = directCost + overhead;
  const grossMargin = v.price - directCost;
  const netProfit = v.price - costPrice;
  const grossRate = v.price > 0 ? (grossMargin / v.price) * 100 : 0;
  const netRate = v.price > 0 ? (netProfit / v.price) * 100 : 0;
  const coefficient = directCost > 0 ? v.price / directCost : 0;
  const advisedPrice = v.targetRate < 100 ? costPrice / (1 - v.targetRate / 100) : 0;

  const update = (key: keyof Values, raw: string) => {
    const n = Number(raw.replace(',', '.'));
    setV((prev) => ({ ...prev, [key]: Number.isFinite(n) && n >= 0 ? n : 0 }));
  };

  const results = [
    { label: 'Déboursé sec', value: eur.format(directCost), note: `dont main-d'œuvre ${eur.format(labour)}` },
    { label: 'Prix de revient', value: eur.format(costPrice), note: `frais généraux compris (${eur.format(overhead)})` },
    { label: 'Marge brute', value: eur.format(grossMargin), note: `${pct(grossRate)} du prix de vente` },
    { label: 'Bénéfice net', value: eur.format(netProfit), note: `${pct(netRate)} du prix de vente` },
    { label: 'Coefficient de vente', value: coefficient.toLocaleString('fr-FR', { maximumFractionDigits: 2 }), note: 'prix de vente ÷ déboursé sec' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      <form className="lg:col-span-7" onSubmit={(e) => e.preventDefault()} aria-label="Données du chantier">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block text-sm font-semibold" style={{ color: INK }}>
                {f.label}
              </span>
              {f.hint && <span className="block text-[13px] text-[#56627E] mt-0.5">{f.hint}</span>}
              <span className="mt-2 flex items-center rounded-[10px] border bg-white transition-shadow focus-within:border-[#1E3A66] focus-within:ring-[3px] focus-within:ring-[#1E3A66]/15" style={{ borderColor: '#DDE3EC' }}>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={f.step}
                  value={v[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full bg-transparent px-4 py-3 text-base focus:outline-none"
                  style={{ color: INK }}
                />
                <span className="pr-4 text-sm text-[#56627E] whitespace-nowrap">{f.unit}</span>
              </span>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setV(DEFAULTS)}
          className="mt-6 py-2.5 text-sm font-semibold underline decoration-[#1E3A66]/35 underline-offset-4 transition-colors hover:decoration-[#1E3A66]"
          style={{ color: ACCENT }}
        >
          Revenir à l'exemple
        </button>
      </form>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24 rounded-2xl bg-[#F7F9FC] p-5 md:p-6 shadow-[inset_0_0_0_1px_#E6EAF1]" aria-live="polite">
          <p className="text-sm font-semibold" style={{ color: INK }}>
            Résultat
          </p>
          <dl className="mt-1">
            {results.map((r) => (
              <div key={r.label} className="py-4 border-b last:border-b-0" style={{ borderColor: '#E6EAF1' }}>
                <dt className="text-sm text-[#56627E]">{r.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight tabular-nums md:text-3xl" style={{ color: INK }}>
                  {r.value}
                </dd>
                <dd className="text-sm text-[#56627E]">{r.note}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 border-t-2 pt-4" style={{ borderColor: '#DDE3EC' }}>
            <p className="text-sm text-[#56627E]">Prix de vente pour {pct(v.targetRate)} de bénéfice</p>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums" style={{ color: INK }}>
              {advisedPrice > 0 ? `${eur.format(advisedPrice)} HT` : '—'}
            </p>
            {grossMargin < 0 && (
              <p className="mt-2 text-sm font-semibold text-[var(--danger)]">
                Votre prix ne couvre même pas le déboursé sec : ce chantier vous coûte de l'argent.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
