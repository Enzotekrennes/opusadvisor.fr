import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const NAVY = '#1A2332';
const GOLD = '#C9A84C';

/** Banner on the e-invoicing deadline: one sentence of context and one way to check where you stand. */
export const WhyNowSection: React.FC = () => {
  return (
    <section className="py-12 md:py-14" style={{ background: NAVY }} aria-labelledby="why-now-title">
      <div
        data-reveal
        className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10"
      >
        <div className="max-w-2xl">
          <h2
            id="why-now-title"
            className="font-heading font-bold leading-tight tracking-tight text-2xl md:text-3xl text-white"
          >
            <span style={{ color: GOLD }}>
              1<sup className="text-[0.6em]">er</sup> septembre 2027 :
            </span>{' '}
            les PME devront émettre leurs factures au format électronique.
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/75 leading-relaxed">
            Un système propre se monte en 2 à 3 mois. Commencé à l'été 2027, il se fera dans l'urgence.{' '}
            <Link
              href="/articles/facturation-electronique-2026"
              className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              Ce que change la réforme
            </Link>
          </p>
        </div>

        <Link
          href="/diagnostic-facture-electronique/"
          className="group shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm md:text-base border-2 text-white hover:bg-white/5 transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
        >
          Faire le diagnostic gratuit (2 min)
          <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
