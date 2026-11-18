'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Wifi, X, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLink } from '@/types';

/** Night blue of the full-screen menu, from the dawn sky of the home page. */
const NIGHT = '#08112A';
/** Height of the menu bar, in px (kept in step with `.site-bar` in globals.css). */
const BAR_HEIGHT = 56;

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
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <rect x="3" y="5" width="18" height="6" rx="3" />
    <rect x="3" y="13" width="18" height="6" rx="3" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="16" cy="16" r="1.4" />
  </svg>
);

/** Battery glyph of a desktop menu bar: a pill, about three quarters full. */
const BatteryGlyph = () => (
  <svg viewBox="0 0 28 13" width={28} height={13} aria-hidden="true">
    <rect x=".65" y=".65" width="23.7" height="11.7" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".85" strokeWidth="1.3" />
    <rect x="2.6" y="2.6" width="14.6" height="7.8" rx="1.8" fill="currentColor" />
    <path d="M26 4.4v4.2a2.1 2.1 0 0 0 0-4.2Z" fill="currentColor" fillOpacity=".85" />
  </svg>
);

/** Relative luminance (0 to 1) of an `rgb()`/`rgba()` colour string; null when it is transparent. */
function luminance(color: string): number | null {
  const parts = color.match(/[\d.]+/g)?.map(Number);
  if (!parts || parts.length < 3 || parts[3] === 0) return null;
  const [r, g, b] = parts.map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Whether what lies under the menu bar is dark: a section marked `data-surface`, or else the nearest
 * ancestor with an opaque background colour. Read at the bar's left edge, under the bar itself.
 */
function darkUnderBar(bar: HTMLElement): boolean {
  const stack = document.elementsFromPoint(8, BAR_HEIGHT / 2);
  const under = stack.find((el) => !bar.contains(el));
  for (let el: Element | null = under ?? null; el; el = el.parentElement) {
    const surface = el.getAttribute('data-surface');
    if (surface) return surface === 'dark';
    const l = luminance(getComputedStyle(el).backgroundColor);
    if (l !== null) return l < 0.4;
  }
  return false;
}

/**
 * Site header: one menu bar, the same on every page and at every scroll position, in the style of a
 * desktop menu bar (logo, navigation, booking button, status items and the clock of the dawn scene).
 * It is a light pane of frosted glass: the page shows through, and its tint follows what lies under it,
 * like a desktop menu bar over its wallpaper (white text over the dawn and dusk scenes, night-blue text
 * over the daylight sections). Without JavaScript it stays night blue, readable on any page.
 * Below 1280 px the navigation moves into a full-screen menu.
 */
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [today, setToday] = useState('');
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();
  const barRef = useRef<HTMLElement>(null);
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

  // The bar's tint follows what scrolls under it, checked once per frame at most.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (barRef.current) setTone(darkUnderBar(barRef.current) ? 'dark' : 'light');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

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

  return (
    <>
      {/* Skip link: first stop for keyboard users, visible only when focused. Every page's <main> carries id="contenu". */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#13213D]"
      >
        Aller au contenu
      </a>

      <header ref={barRef} className="site-bar" data-tone={tone}>
        <nav aria-label="Navigation principale" className="site-bar-inner">
          <Link href="/" aria-label="Retour à l'accueil" onClick={() => window.scrollTo(0, 0)} className="site-bar-logo">
            <img src="/images/opus-logo-white-trim.webp" alt="" width={194} height={30} className="logo-on-dark" />
            <img src="/images/opus-logo-navy-trim.webp" alt="" width={194} height={30} className="logo-on-light" />
          </Link>

          <div className="site-bar-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="site-bar-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="site-bar-right">
            <Link href="/contact" onClick={handleNavClick} className="site-bar-cta">
              Réserver le pré-audit gratuit
            </Link>
            {/* Decorative status items of a desktop menu bar. */}
            <span className="site-bar-status" aria-hidden="true">
              <ControlsGlyph />
              <Wifi size={16} strokeWidth={1.8} />
              <BatteryGlyph />
              <span className="tabular-nums">{today ? `${today} ${SCENE_TIME}` : SCENE_TIME}</span>
            </span>
            {/* Burger button: 44 px touch target. The open menu covers it and carries its own close button. */}
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="site-bar-burger"
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
            className="-mr-2.5 p-2.5 text-white/80 transition-colors hover:text-white"
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
              className={`py-1 text-4xl font-bold tracking-tight text-white/80 underline-offset-[10px] transition-all duration-300 hover:text-white aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:decoration-white/60 motion-reduce:transition-opacity ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 motion-reduce:translate-y-0'
              }`}
              style={{ transitionDelay: `${index * 80 + 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={handleNavClick}
            className={`mt-4 inline-flex items-center gap-2.5 rounded-full bg-white py-4 pl-7 pr-6 text-lg font-semibold text-[#1E3A66] transition-all duration-300 motion-reduce:transition-opacity ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 motion-reduce:translate-y-0'
            }`}
            style={{ transitionDelay: `${mobileLinks.length * 80 + 100}ms` }}
          >
            Réserver le pré-audit gratuit
            <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
          </Link>
          <a
            href="tel:+33615756549"
            className={`inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-white/80 transition-all duration-300 hover:text-white motion-reduce:transition-opacity ${
              isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 motion-reduce:translate-y-0'
            }`}
            style={{ transitionDelay: `${(mobileLinks.length + 1) * 80 + 100}ms` }}
          >
            <Phone size={18} strokeWidth={2} aria-hidden="true" />
            06 15 75 65 49
          </a>
        </div>

        <div className="flex justify-center pb-12">
          <img src="/images/opus-icon.png" alt="" width={64} height={64} loading="lazy" className="h-16 w-16 object-contain opacity-30" />
        </div>
      </div>
    </>
  );
};
