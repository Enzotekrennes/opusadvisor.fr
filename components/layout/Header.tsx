'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import type { NavLink } from '@/types';

const NAVY = '#1A2332';
const GOLD = '#C9A84C';

// "Contact" n'est plus un lien : c'est le bouton de réservation, toujours visible.
const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Secteurs', href: '/secteurs' },
  { label: 'Cas clients', href: '/cas-clients' },
  { label: 'Articles', href: '/articles' },
  { label: 'Outils', href: '/outils' },
  { label: 'Équipe', href: '/equipe' },
];

const mobileLinks: NavLink[] = [{ label: 'Accueil', href: '/' }, ...navLinks];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Closes the menu and gives focus back to the button that opened it. */
  const closeMenu = () => {
    setIsMenuOpen(false);
    burgerRef.current?.focus();
  };

  // The open menu covers the page: focus starts on its close button, Escape closes it,
  // and Tab cycles inside it instead of reaching the hidden page behind.
  useEffect(() => {
    if (!isMenuOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button');
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // Ferme le menu lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Empêche le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    const currentPath = pathname ?? '/';
    const normalized =
      currentPath.endsWith('/') && currentPath !== '/' ? currentPath.slice(0, -1) : currentPath;
    return normalized === href || (href !== '/' && normalized.startsWith(href));
  };

  return (
    <>
      {/* Skip link: first stop for keyboard users, visible only when focused. Every page's <main> carries id="contenu". */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-[#1A2332] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-1 md:py-1.5">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center z-10"
              aria-label="Retour à l'accueil"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                src="/images/opus-logo-header.webp"
                alt="Logo Opus Advisor"
                width={240}
                height={48}
                className="h-10 w-[185px] md:h-12 md:w-[240px] object-cover object-center"
              />
            </Link>

            {/* Navigation ordinateur + bouton de réservation (en dessous de 1280 px : menu burger) */}
            <div className="hidden xl:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <div key={link.label} className="relative">
                    <Link
                      href={link.href}
                      onClick={handleNavClick}
                      className={`whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                        active ? 'text-[#1A2332]' : 'text-[#5b6472] hover:text-[#1A2332]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                        style={{ background: GOLD }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                );
              })}
              <Link
                href="/contact"
                onClick={handleNavClick}
                className="inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-md text-sm font-semibold bg-[#1A2332] text-[#FAF7F0] hover:bg-[#26334a] transition-colors"
              >
                Réserver le pré-audit
              </Link>
            </div>

            {/* Burger button: 44 px touch target. The open menu covers it and carries its own close button. */}
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="xl:hidden -mr-2 p-2 transition-colors text-gray-700"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
              aria-controls="menu-mobile"
            >
              <Menu size={28} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay plein écran */}
      <div
        ref={panelRef}
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[55] flex flex-col xl:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: NAVY }}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {/* Same row height and padding as the header, so the close button sits where the burger was. */}
        <div className="container mx-auto px-6 py-1 md:py-1.5">
          <div className="flex h-11 md:h-12 items-center justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              className="-mr-2 p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Fermer le menu"
            >
              <X size={28} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-9 px-8">
          {mobileLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleNavClick}
              className={`text-4xl font-bold text-white/80 hover:text-white transition-all duration-300 hover:scale-105 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 80 + 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={handleNavClick}
            className={`mt-4 inline-flex items-center px-7 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ background: GOLD, color: NAVY, transitionDelay: `${mobileLinks.length * 80 + 100}ms` }}
          >
            Réserver le pré-audit gratuit
          </Link>
        </div>

        <div className="pb-12 flex justify-center">
          <img
            src="/images/opus-icon.png"
            alt="Logo Opus Advisor"
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 object-contain opacity-30"
          />
        </div>
      </div>
    </>
  );
};
