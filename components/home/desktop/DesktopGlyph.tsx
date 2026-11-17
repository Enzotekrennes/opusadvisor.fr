import React from 'react';
import { CalendarCheck, Calculator, FolderOpen, GraduationCap, HardHat, KeyRound, type LucideIcon } from 'lucide-react';
import type { DesktopIcon } from '@/lib/homeDesktop';

/** The pictogram behind each icon name of the home desktop (one icon set, one stroke weight). */
const GLYPHS: Record<DesktopIcon, LucideIcon> = {
  formation: GraduationCap,
  conciergerie: KeyRound,
  btp: HardHat,
  cases: FolderOpen,
  tools: Calculator,
  booking: CalendarCheck,
};

/** Draws one desktop pictogram; decorative, the surrounding label names it. */
export const DesktopGlyph: React.FC<{ icon: DesktopIcon; size: number; strokeWidth?: number }> = ({ icon, size, strokeWidth = 1.8 }) => {
  const Glyph = GLYPHS[icon];
  return <Glyph size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
};
