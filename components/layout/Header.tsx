'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Wifi, X } from 'lucide-react';
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

/** Control Center glyph of a desktop menu bar: two toggles. */
const ControlsGlyph = () => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <rect x="3" y="5" width="18" height="6" rx="3" />
    <rect x="3" y="13" width="18" height="6" rx="3" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="16" cy="16" r="1.4" />
  </svg>
);

/** Battery glyph of a desktop menu bar: a pill, about three quarters full. */
const BatteryGlyph = () => (
  <svg viewBox="0 0 28 13" width={27} height={13} aria-hidden="true">
    <rect x=".65" y=".65" width="23.7" height="11.7" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".85" strokeWidth="1.3" />
    <rect x="2.6" y="2.6" width="14.6" height="7.8" rx="1.8" fill="currentColor" />
    <path d="M26 4.4v4.2a2.1 2.1 0 0 0 0-4.2Z" fill="currentColor" fillOpacity=".85" />
  </svg>
);

/** Time shown in the home menu bar: the moment of the dawn scene behind it, not the visitor's clock. */
const SCENE_TIME = '07:52';

/**
 * Site header, fixed at the top of every page.
 *
 * @param variant `desktop` on the home page: a transparent menu bar sits over the hero's desktop scene
 *   and scrolls away with it; the fixed header then slides in, in dark glass while it still lies over
 *   the hero, in its usual white once the hero is passed. Without JavaScript only the menu bar shows
 *   (the fixed header stays hidden), so the navigation is always reachable at the top.
 * @param heroId with `desktop`: id of the dark hero section the header lies over at the top of the page.
 */
export const Header: React.FC<{ variant?: 'default' | 'desktop'; heroId?: string }> = ({ variant = 'default', heroId }) => {
  const desktop = variant === 'desktop';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // On the home page the fixed header waits until the menu bar has scrolled out of view...
  const [solid, setSolid] = useState(!desktop);
  // ...and stays dark while the hero is still under it.
  const [overHero, setOverHero] = useState(desktop);
  const dark = desktop && overHero;
  const [today, setToday] = useState('');
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  /** Opens the menu, remembering which burger opened it so focus can return there. */
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    setIsMenuOpen(true);
  };

  /** Closes the menu and gives focus back to the button that opened it. */
  const closeMenu = () => {
    setIsMenuOpen(false);
    (openerRef.current ?? burgerRef.current)?.focus();
  };

  useEffect(() => {
    if (!desktop || !barRef.current) return;
    // Today's date beside the scene's time, like a real menu bar; set here so the static page never shows a stale date.
    setToday(new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date()));
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    observer.observe(barRef.current);
    const hero = heroId ? document.getElementById(heroId) : null;
    // The viewport minus the header's height: the hero is under the header while any of it shows below.
    const heroWatch = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), { rootMargin: '-64px 0px 0px 0px' });
    if (hero) heroWatch.observe(hero);
    else setOverHero(false);
    return () => {
      observer.disconnect();
      heroWatch.disconnect();
    };
  }, [desktop, heroId]);

  // The open menu covers the page: focus starts on its close button, Escape closes it,
  // and Tab cycles inside it instead of reaching the hidden page behind.
  useEffect(() => {
    if (!isMenuOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        (openerRef.current ?? burgerRef.current)?.focus();
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

      {desktop && (
        <nav
          ref={barRef}
          aria-label="Navigation principale"
          className="absolute inset-x-0 top-0 z-50 text-white [text-shadow:0_1px_2px_rgba(3,8,22,0.35)]"
        >
          <div className="flex h-14 items-center gap-[22px] px-5 xl:h-10">
            <Link
              href="/"
              aria-label="Retour à l'accueil"
              className="mr-2 shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <img src="/images/opus-logo-white.webp" alt="" width={120} height={30} className="block h-[30px] w-[120px]" />
            </Link>
            <div className="hidden items-center gap-[22px] text-[13px] xl:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-sm text-white/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Link
                href="/contact"
                className="hidden rounded-lg bg-white/95 px-[11px] py-1 text-[13px] font-semibold text-[#1E3A66] shadow-[0_1px_2px_rgba(3,8,22,0.25)] [text-shadow:none] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Réserver le pré-audit
              </Link>
              {/* Decorative status items of a desktop menu bar. */}
              <span className="hidden items-center gap-4 text-[13px] xl:flex" aria-hidden="true">
                <ControlsGlyph />
                <Wifi size={15} strokeWidth={1.8} />
                <BatteryGlyph />
                <span className="tabular-nums">{today ? `${today} ${SCENE_TIME}` : SCENE_TIME}</span>
              </span>
              <button
                type="button"
                onClick={openMenu}
                className="-mr-2 p-2 text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white xl:hidden"
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
                aria-controls="menu-mobile"
              >
                <Menu size={28} aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-[transform,background-color,border-color] duration-300 ease-out ${
          solid ? 'translate-y-0' : '-translate-y-full'
        } ${dark ? 'border-white/10 bg-[#0A1733]/75' : 'border-gray-100 bg-white/80'}`}
        aria-hidden={solid ? undefined : true}
        inert={!solid}
      >
        <nav className="container mx-auto px-6 py-1 md:py-1.5">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center z-10"
              aria-label="Retour à l'accueil"
              onClick={() => window.scrollTo(0, 0)}
            >
              {dark ? (
                <img
                  src="/images/opus-logo-white.webp"
                  alt="Logo Opus Advisor"
                  width={120}
                  height={30}
                  className="my-[5px] block h-[30px] w-[120px] md:my-[9px]"
                />
              ) : (
                <img
                  src="/images/opus-logo-header.webp"
                  alt="Logo Opus Advisor"
                  width={240}
                  height={48}
                  className="h-10 w-[185px] md:h-12 md:w-[240px] object-cover object-center"
                />
              )}
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
                        dark
                          ? active
                            ? 'text-white'
                            : 'text-white/75 hover:text-white'
                          : active
                            ? 'text-[#1A2332]'
                            : 'text-[#5b6472] hover:text-[#1A2332]'
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
                className={`inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  dark ? 'bg-white text-[#1E3A66] hover:bg-white/90' : 'bg-[#1A2332] text-[#FAF7F0] hover:bg-[#26334a]'
                }`}
              >
                Réserver le pré-audit
              </Link>
            </div>

            {/* Burger button: 44 px touch target. The open menu covers it and carries its own close button. */}
            <button
              ref={burgerRef}
              type="button"
              onClick={openMenu}
              className={`xl:hidden -mr-2 p-2 transition-colors ${dark ? 'text-white' : 'text-gray-700'}`}
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
