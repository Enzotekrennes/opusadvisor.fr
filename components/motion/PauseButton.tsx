'use client';

import React from 'react';
import { Pause, Play } from 'lucide-react';

/**
 * Bouton pause / lecture des démonstrations animées : un contenu qui défile seul plus de
 * cinq secondes doit pouvoir être arrêté (WCAG 2.2.2).
 */
export const PauseButton: React.FC<{ paused: boolean; onToggle: () => void; className?: string }> = ({
  paused,
  onToggle,
  className = '',
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={paused ? "Relancer l'animation" : "Mettre l'animation en pause"}
    className={`inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-xs font-semibold text-[#3C4866] transition-colors hover:bg-[#F3F5F9] [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:px-3.5 ${className}`}
    style={{ borderColor: '#DDE3EC' }}
  >
    {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
    {paused ? 'Lecture' : 'Pause'}
  </button>
);
