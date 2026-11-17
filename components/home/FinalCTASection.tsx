import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const GOLD = '#C9A84C';
const NAVY = '#1A2332';
const RULE = 'rgba(255,255,255,0.16)';

/** One way in: the free pre-audit, what the visitor leaves with, and the paid Audit Stack as a quiet text link. */
export const FinalCTASection: React.FC = () => {
  return (
    <section id="contact" className="py-24 md:py-32" style={{ background: NAVY }} aria-labelledby="cta-title">
      <div className="container mx-auto px-6 max-w-5xl">
        <div data-reveal className="max-w-3xl">
          <h2
            id="cta-title"
            className="font-heading font-bold leading-[1.05] tracking-tight text-3xl md:text-5xl text-white"
          >
            Commencez par le pré-audit
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/75 leading-relaxed">
            30 minutes en visio, gratuites et sans engagement. Vous partagez votre écran, et on regarde vos outils
            ensemble.
          </p>
        </div>

        <div
          data-reveal
          data-reveal-delay="1"
          className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start"
          style={{ borderColor: RULE }}
        >
          <div className="md:col-span-7">
            <p className="font-semibold text-white">Vous repartez avec :</p>
            <ul className="mt-4 space-y-3 text-base md:text-lg text-white/75 leading-relaxed list-disc pl-5 marker:text-[#C9A84C]">
              <li>3 points de friction repérés dans vos outils, avec la façon de régler chacun ;</li>
              <li>un avis franc : si une mission ne vaut pas le coup pour vous, on vous le dit.</li>
            </ul>
          </div>

          <div className="md:col-span-5">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-base transition-colors"
              style={{ background: GOLD, color: NAVY }}
            >
              Réserver le pré-audit gratuit
              <ArrowRight size={18} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Créneaux disponibles sous 5 jours. Annulation libre jusqu'à 2 h avant.
            </p>
          </div>
        </div>

        <p data-reveal className="mt-14 text-base text-white/70 leading-relaxed max-w-3xl">
          Vous voulez seulement un avis écrit et chiffré sur vos outils ?{' '}
          <Link
            href="/services#audit-stack"
            className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
          >
            L'Audit Stack
          </Link>{' '}
          coûte 990 € et se livre en 10 jours ouvrés.
        </p>
      </div>
    </section>
  );
};
