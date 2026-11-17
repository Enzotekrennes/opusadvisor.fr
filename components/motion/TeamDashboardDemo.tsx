'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PauseButton } from '@/components/motion/PauseButton';

// Site palette: ink for text and figures, navy accent for the selection, cool grey rules.
const INK = '#13213D';
const INK_SOFT = '#56627E';
const ACCENT = '#1E3A66';
const RULE = '#E6EAF1';
const ROW_RULE = '#EEF1F6';

type Status = 'Mandat signé' | 'En visite' | 'Offre reçue' | 'Compromis' | 'Vendu';
const NEXT: Record<Status, Status> = {
  'Mandat signé': 'En visite',
  'En visite': 'Offre reçue',
  'Offre reçue': 'Compromis',
  Compromis: 'Vendu',
  Vendu: 'Vendu',
};
// Status chips in the hero's vocabulary: grey to start, blue in progress, amber waiting, green agreed, ink sold.
const CHIP: Record<Status, [string, string]> = {
  'Mandat signé': ['#EEF2F8', '#3C4866'],
  'En visite': ['#E8EEF8', '#22406E'],
  'Offre reçue': ['#FFF2D4', '#8A5A00'],
  Compromis: ['#E4F5EA', '#1E7B43'],
  Vendu: [INK, '#FFFFFF'],
};

interface Bien { label: string; prix: string; status: Status }
interface Agent { initials: string; name: string; mandats: number; visites: number; offres: number; ventes: number; biens: Bien[]; update: number }

// Données d'exemple (fictives), affichées comme telles sous la maquette.
const AGENTS: Agent[] = [
  {
    initials: 'CR', name: 'Camille R.', mandats: 14, visites: 11, offres: 3, ventes: 2, update: 1,
    biens: [
      { label: 'T3 · Rennes centre', prix: '245 000 €', status: 'Offre reçue' },
      { label: 'Maison · Cesson-Sévigné', prix: '389 000 €', status: 'En visite' },
      { label: 'T2 · Saint-Malo', prix: '198 000 €', status: 'Compromis' },
      { label: 'Studio · Rennes Villejean', prix: '112 000 €', status: 'Mandat signé' },
    ],
  },
  {
    initials: 'JM', name: 'Julien M.', mandats: 12, visites: 8, offres: 2, ventes: 1, update: 1,
    biens: [
      { label: 'Maison · Bruz', prix: '312 000 €', status: 'En visite' },
      { label: 'T4 · Rennes Thabor', prix: '365 000 €', status: 'Mandat signé' },
      { label: 'T2 · Vitré', prix: '139 000 €', status: 'Offre reçue' },
      { label: 'Longère · Betton', prix: '420 000 €', status: 'Compromis' },
    ],
  },
  {
    initials: 'SL', name: 'Sarah L.', mandats: 11, visites: 7, offres: 3, ventes: 1, update: 3,
    biens: [
      { label: 'T3 · Saint-Grégoire', prix: '268 000 €', status: 'Compromis' },
      { label: 'Maison · Pacé', prix: '335 000 €', status: 'Mandat signé' },
      { label: 'T2 · Chantepie', prix: '172 000 €', status: 'Vendu' },
      { label: 'Studio · Rennes gare', prix: '98 000 €', status: 'Offre reçue' },
    ],
  },
  {
    initials: 'TB', name: 'Thomas B.', mandats: 9, visites: 5, offres: 1, ventes: 0, update: 0,
    biens: [
      { label: 'T2 · Rennes Sainte-Anne', prix: '205 000 €', status: 'Mandat signé' },
      { label: 'Maison · Laillé', prix: '289 000 €', status: 'En visite' },
      { label: 'T3 · Cesson-Sévigné', prix: '233 000 €', status: 'Mandat signé' },
      { label: 'Terrain · Melesse', prix: '89 000 €', status: 'Offre reçue' },
    ],
  },
];

const KPIS = [
  { label: 'Mandats actifs', value: 46 },
  { label: 'Visites (7 jours)', value: 31 },
  { label: 'Offres en cours', value: 9 },
  { label: 'Ventes du mois', value: 4 },
];

const TICK_MS = 400;
const AGENT_MS = 4400;
const UPDATE_DELAY_MS = 1600;

/**
 * Maquette vivante de l'outil de suivi : chiffres qui se comptent, sélection qui passe d'un agent
 * à l'autre, statut d'un bien qui se met à jour, avec un bouton pause. Sans JavaScript : maquette fixe,
 * premier agent sélectionné. Avec « réduire les animations », tout tourne sans le clignotement du bien
 * mis à jour. Un clic sur un agent l'affiche et arrête le défilement.
 */
export const TeamDashboardDemo: React.FC = () => {
  const box = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const pinned = useRef(false);
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [counts, setCounts] = useState(KPIS.map((k) => k.value));
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const [updated, setUpdated] = useState<number | null>(null); // index de l'agent dont un bien vient de changer

  useEffect(() => {
    setAnimate(true);
    setCounts(KPIS.map(() => 0));
    let counted = false;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting && !counted) {
          counted = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / 1200);
            setCounts(KPIS.map((x) => Math.round(x.value * (1 - Math.pow(1 - k, 3)))));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // Une seule horloge, en pause sur le bouton, hors écran, onglet masqué ou après un clic sur un agent.
  useEffect(() => {
    if (!animate) return;
    let elapsed = 0;
    const id = setInterval(() => {
      if (pausedRef.current || pinned.current || !inView.current || document.hidden) return;
      elapsed += TICK_MS;
      if (elapsed === UPDATE_DELAY_MS) setUpdated(selRef.current);
      if (elapsed >= AGENT_MS) {
        elapsed = 0;
        setUpdated(null);
        selRef.current = (selRef.current + 1) % AGENTS.length;
        setSel(selRef.current);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [animate]);

  const agent = AGENTS[sel];

  return (
    <div ref={box} className="rounded-xl overflow-hidden bg-white" role="group" aria-label="Maquette de l'outil de suivi de l'équipe, avec des données d'exemple">
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5 border-b" style={{ borderColor: RULE }}>
        <span className="flex items-center gap-2.5 font-bold text-base md:text-lg" style={{ color: INK }}>
          <LayoutDashboard size={20} aria-hidden="true" /> Suivi de l'équipe
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs md:text-sm" style={{ color: INK_SOFT }}>
            Octobre · <b style={{ color: INK }}>Manager</b>
          </span>
          <PauseButton
            paused={paused}
            onToggle={() => {
              pausedRef.current = !pausedRef.current;
              setPaused(pausedRef.current);
            }}
            className={animate ? '' : 'invisible'}
          />
        </span>
      </div>

      <div className="p-4 md:p-6" style={{ background: '#F7F9FC' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          {KPIS.map((k, i) => (
            <div key={k.label} className="rounded-xl border bg-white px-3.5 py-3" style={{ borderColor: RULE }}>
              <div className="text-xs" style={{ color: INK_SOFT }}>{k.label}</div>
              <div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight tabular-nums" style={{ color: INK }}>
                {counts[i]}
              </div>
            </div>
          ))}
        </div>

        <table className="mt-4 w-full rounded-xl border bg-white text-sm md:text-[15px] border-separate border-spacing-0 overflow-hidden" style={{ borderColor: RULE }}>
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider" style={{ color: INK_SOFT }}>
              <th className="font-semibold px-3 md:px-4 py-2.5 border-b" style={{ borderColor: RULE }}>Agent</th>
              <th className="font-semibold px-2 py-2.5 border-b" style={{ borderColor: RULE }}>Mandats</th>
              <th className="hidden sm:table-cell font-semibold px-2 py-2.5 border-b" style={{ borderColor: RULE }}>Visites</th>
              <th className="hidden sm:table-cell font-semibold px-2 py-2.5 border-b" style={{ borderColor: RULE }}>Offres</th>
              <th className="font-semibold px-2 py-2.5 border-b" style={{ borderColor: RULE }}>Ventes</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a, i) => (
              <tr
                key={a.name}
                onClick={() => {
                  pinned.current = true;
                  setUpdated(null);
                  selRef.current = i;
                  setSel(i);
                }}
                className="cursor-pointer transition-colors duration-500"
                style={{ background: i === sel ? '#EEF2F8' : '#FFFFFF' }}
              >
                <td className="px-3 md:px-4 py-2.5 border-b" style={{ borderColor: ROW_RULE, boxShadow: i === sel ? `inset 3px 0 0 ${ACCENT}` : 'none' }}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold mr-2.5 align-middle" style={{ background: ACCENT, color: '#FFFFFF' }}>
                    {a.initials}
                  </span>
                  <span style={{ color: INK }}>{a.name}</span>
                </td>
                <td className="px-2 py-2.5 border-b tabular-nums" style={{ borderColor: ROW_RULE }}>{a.mandats}</td>
                <td className="hidden sm:table-cell px-2 py-2.5 border-b tabular-nums" style={{ borderColor: ROW_RULE }}>{a.visites}</td>
                <td className="hidden sm:table-cell px-2 py-2.5 border-b tabular-nums" style={{ borderColor: ROW_RULE }}>{a.offres}</td>
                <td className="px-2 py-2.5 border-b tabular-nums" style={{ borderColor: ROW_RULE }}>{a.ventes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-bold text-sm md:text-base" style={{ color: INK }}>
            Biens de {agent.name}
          </span>
          <span
            className="text-xs transition-opacity duration-500"
            style={{ color: INK_SOFT, opacity: updated === sel ? 1 : 0 }}
            aria-live="polite"
          >
            {updated === sel ? `Mis à jour par ${agent.name} · à l'instant` : ''}
          </span>
        </div>
        <ul className="mt-2 space-y-2">
          {agent.biens.map((b, i) => {
            const changed = updated === sel && i === agent.update;
            const status = changed ? NEXT[b.status] : b.status;
            return (
              <li
                key={`${agent.name}-${b.label}`}
                className={`flex items-center gap-3 rounded-lg border bg-white px-3 md:px-3.5 py-2.5 text-sm md:text-[15px] ${changed ? 'live-flash' : ''}`}
                style={{ borderColor: changed ? ACCENT : RULE, transition: 'border-color 0.5s' }}
              >
                <span className="flex-1 min-w-0 truncate" style={{ color: INK }}>{b.label}</span>
                <span className="hidden sm:inline font-semibold tabular-nums" style={{ color: INK_SOFT }}>{b.prix}</span>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-500"
                  style={{ background: CHIP[status][0], color: CHIP[status][1] }}
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-right text-xs" style={{ color: INK_SOFT }}>Données d'exemple</p>
      </div>
    </div>
  );
};
