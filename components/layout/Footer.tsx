'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';
import type { FooterSection } from '@/types';
import { MobileCTABar } from '@/components/layout/MobileCTABar';

/** Night blue of the rooftops at dusk, so the close of each page runs into the footer. */
const FOOTER_BG = '#070E22';

export const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: 'Nos services',
      links: [
        { label: 'Pré-audit gratuit', href: '/services#pre-audit' },
        { label: 'Audit Stack', href: '/services#audit-stack' },
        { label: 'Diagnostic', href: '/services#diagnostic' },
        { label: 'Mise en œuvre', href: '/services#implementation' },
        { label: 'Gardien du système', href: '/services#suivi' },
        { label: 'Programme pilote BTP', href: '/cas-clients#programme-pilote' },
      ],
    },
    {
      title: 'Navigation',
      links: [
        { label: 'Secteurs', href: '/secteurs' },
        { label: 'Cas clients', href: '/cas-clients' },
        { label: 'Articles', href: '/articles' },
        { label: 'Outils gratuits', href: '/outils' },
        { label: 'Diagnostic facture électronique', href: '/diagnostic-facture-electronique/' },
        { label: 'Consultant à Rennes', href: '/consultant-rennes' },
        { label: 'Équipe', href: '/equipe' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/opus_enzo/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/enzo-monnier/', label: 'LinkedIn' },
  ];

  return (
    <footer className="text-white font-[family-name:var(--font-inter)]" style={{ background: FOOTER_BG }}>
      <div className="container mx-auto px-6 max-w-6xl pt-16 md:pt-20 pb-28 xl:pb-20">
        {/* Haut : marque (gauche) + colonnes de liens (droite) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <img
              src="/images/opus-logo-white-trim.webp"
              alt="Opus Advisor"
              width={168}
              height={26}
              loading="lazy"
              className="block h-[26px] w-[168px]"
            />
            <p className="mt-5 text-sm md:text-[15px] text-white/65 leading-relaxed max-w-xs">
              Organisation et automatisation de la gestion des petites entreprises : formation,
              immobilier, BTP. Objectif : 10 h par semaine rendues à votre entreprise.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 text-[13px] font-semibold text-white/60">{section.title}</h2>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-block py-1.5 text-sm md:text-[15px] text-white/75 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bas : copyright + réseaux */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs md:text-sm text-white/60">
            © {new Date().getFullYear()} Opus Advisor · Automatisation de la gestion des PME ·{' '}
            <Link href="/mentions-legales" className="hover:text-white transition-colors duration-200">
              Mentions légales
            </Link>
          </p>
          <div className="-mx-3 flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="grid h-11 w-11 place-items-center text-white/60 hover:text-white transition-colors duration-200"
                aria-label={`Opus Advisor sur ${social.label}`}
                title={`Opus Advisor sur ${social.label}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={20} />
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <MobileCTABar />
    </footer>
  );
};
