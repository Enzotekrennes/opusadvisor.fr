'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Wifi, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLink } from '@/types';

/** Night blue of the menu bar and of the full-screen menu, from the dawn sky of the home page. */
const NIGHT = '#08112A';

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

/** Time shown in the menu bar: the moment of the dawn scene of the home page, not the visitor's clock. */
const SCENE_TIME = '07:52';

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

/**
 * Site header: one menu bar, the same on every page and at every scroll position. Night-blue glass,
 * fixed at the top, in the style of a desktop menu bar (logo, navigation, booking button, status items
 * and the clock of the dawn scene). Below 1280 px the navigation moves into a full-screen menu.
 */
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [today, setToday] = useState('');
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Closes the menu and gives focus back to the button that opened it. */
  const closeMenu = () => {
    setIsMenuOpen(false);
    burgerRef.current?.focus();
  };

  // Today's date beside the scene's time, like a real menu bar; set here so the static page never shows a stale date.
  useEffect(() => {
    setToday(new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date()));
  }, []);

  // The open menu covers the page: focus starts on its close button, Escape closes it,
  // and Tab cycles inside it instead of reaching the hidden page behind.
  useEffect(() => {
    if (!isMenuOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
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
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
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
    const normalized = currentPath.endsWith('/') && currentPath !== '/' ? currentPath.slice(0, -1) : currentPath;
    return normalized === href || (href !== '/' && normalized.startsWith(href));
  };

  const focusRing = 'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

  return (
    <>
      {/* Skip link: first stop for keyboard users, visible only when focused. Every page's <main> carries id="contenu". */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#13213D]"
      >
        Aller au contenu
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white backdrop-blur-xl backdrop-saturate-150 [text-shadow:0_1px_2px_rgba(3,8,22,0.35)]"
        style={{ background: 'rgba(8, 17, 42, 0.96)' }}
      >
        <nav aria-label="Navigation principale" className="flex h-14 items-center gap-6 px-5 xl:h-11">
          <Link href="/" aria-label="Retour à l'accueil" onClick={() => window.scrollTo(0, 0)} className={`mr-2 shrink-0 ${focusRing}`}>
            <img src="/images/opus-logo-white-trim.webp" alt="" width={168} height={26} className="block h-[26px] w-[168px]" />
          </Link>

          <div className="hidden items-center gap-6 text-[13.5px] xl:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  aria-current={active ? 'page' : undefined}
                  className={`relative whitespace-nowrap transition-colors ${focusRing} ${
                    active
                      ? 'font-semibold text-white after:absolute after:-bottom-[7px] after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-white'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/contact"
              onClick={handleNavClick}
              className="hidden rounded-lg bg-white/95 px-3 py-1.5 text-[13.5px] font-semibold text-[#1E3A66] shadow-[0_1px_2px_rgba(3,8,22,0.25)] [text-shadow:none] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
            >
              Réserver le pré-audit
            </Link>
            {/* Decorative status items of a desktop menu bar. */}
            <span className="hidden items-center gap-4 text-[13.5px] xl:flex" aria-hidden="true">
              <ControlsGlyph />
              <Wifi size={15} strokeWidth={1.8} />
              <BatteryGlyph />
              <span className="tabular-nums">{today ? `${today} ${SCENE_TIME}` : SCENE_TIME}</span>
            </span>
            {/* Burger button: 44 px touch target. The open menu covers it and carries its own close button. */}
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={`-mr-2 p-2 text-white transition-opacity hover:opacity-80 xl:hidden ${focusRing}`}
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
        style={{ background: NIGHT }}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {/* Same row height and padding as the menu bar, so the close button sits where the burger was. */}
        <div className="flex h-14 items-center justify-end px-5">
          <button
            ref={closeRef}
            type="button"
            onClick={closeMenu}
            className="-mr-2 p-2 text-white/80 transition-colors hover:text-white"
            aria-label="Fermer le menu"
          >
            <X size={28} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
          {mobileLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleNavClick}
              aria-current={isActive(link.href) && (link.href !== '/' || pathname === '/') ? 'page' : undefined}
              className={`text-4xl font-bold tracking-tight text-white/80 transition-all duration-300 hover:text-white ${
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
            className={`mt-4 inline-flex items-center rounded-full bg-white px-7 py-4 text-lg font-semibold text-[#1E3A66] transition-all duration-300 ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${mobileLinks.length * 80 + 100}ms` }}
          >
            Réserver le pré-audit gratuit
          </Link>
        </div>

        <div className="flex justify-center pb-12">
          <img src="/images/opus-icon.png" alt="" width={64} height={64} loading="lazy" className="h-16 w-16 object-contain opacity-30" />
        </div>
      </div>
    </>
  );
};
