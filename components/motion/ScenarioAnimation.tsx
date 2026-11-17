'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Table2, Sigma, Layers, FileText, FolderOpen, Mail, Split, User, Clock, Check, type LucideIcon } from 'lucide-react';
import { scenarios, type AppKey, type ScenarioKey, type ScenarioModule } from '@/lib/caseVisuals';
import { PauseButton } from '@/components/motion/PauseButton';

const APPS: Record<AppKey, { name: string; color: string; icon: LucideIcon; ink?: string }> = {
  airtable: { name: 'Airtable', color: '#2D7FF9', icon: Table2 },
  tools: { name: 'Tools', color: '#8B5CF6', icon: Sigma },
  aggregator: { name: 'Tools', color: '#8B5CF6', icon: Layers },
  docs: { name: 'Google Docs', color: '#4285F4', icon: FileText },
  drive: { name: 'Google Drive', color: '#F4B400', icon: FolderOpen, ink: '#3A2A00' },
  gmail: { name: 'Gmail', color: '#EA4335', icon: Mail },
  ifelse: { name: 'If-else', color: '#22A55B', icon: Split },
  qontoClient: { name: 'Qonto', color: '#1F2937', icon: User },
  qontoInvoice: { name: 'Qonto', color: '#1F2937', icon: FileText },
};

const W = 952; // largeur de la carte, en unités SVG (le dessin s'adapte à la largeur réelle)
const HEAD = 64;
const TOP = 40;
const ROW_H = 222;
const R = 44;
// Site palette: the navy accent marks the path already run, the hero's green marks a finished module.
const ACCENT = '#1E3A66';
const OK = '#1E7B43';
const INK = '#13213D';
const INK_SOFT = '#56627E';
const STEP_MS = 650;
const PAUSE_MS = 2200;

interface Placed { m: ScenarioModule; x: number; y: number; seg: string | null }

/** Découpe un libellé en lignes courtes (le SVG ne sait pas faire de retour à la ligne). */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

function layout(key: ScenarioKey) {
  const s = scenarios[key];
  const colW = s.cols === 3 ? 260 : 200;
  const margin = (W - s.cols * colW) / 2;
  const cx = (c: number, w = colW) => margin + c * w + w / 2;
  const cy = (r: number) => HEAD + TOP + R + r * ROW_H;

  const placed: Placed[] = [];
  s.rows.forEach((row, r) =>
    row.forEach((m, c) => {
      const x = cx(c);
      const y = cy(r);
      const prev = placed[placed.length - 1];
      let seg: string | null = null;
      if (prev && c > 0) seg = `M${prev.x},${prev.y} L${x},${y}`;
      else if (prev) {
        const mid = prev.y + 142;
        seg = `M${prev.x},${prev.y} C${prev.x + 150},${prev.y} ${prev.x + 150},${mid} ${prev.x},${mid} L${x},${mid} C${x - 150},${mid} ${x - 150},${y} ${x},${y}`;
      }
      placed.push({ m, x, y, seg });
    }),
  );

  const parent = placed[placed.length - 1];
  const bw = (s.cols * colW) / s.branches.length;
  const split = parent.y + 142;
  const yb = cy(s.rows.length);
  const branches: Placed[] = s.branches.map((m, j) => {
    const x = margin + j * bw + bw / 2;
    return { m, x, y: yb, seg: `M${parent.x},${parent.y} L${parent.x},${split} L${x},${split} L${x},${yb}` };
  });

  return { s, placed, branches, height: yb + R + 120, wrapAt: s.cols === 3 ? 24 : 20 };
}

type State = 'static' | 'pending' | 'active' | 'done';

const Module: React.FC<{ p: Placed; state: State; wrapAt: number }> = ({ p, state, wrapAt }) => {
  const app = APPS[p.m.app];
  const Icon = app.icon;
  const nameW = app.name.length * 11.4;
  const badgeW = 14 + String(p.m.n).length * 8;
  const start = p.x - (nameW + 8 + badgeW) / 2;
  const nameY = p.y + R + 32;
  const pillW = p.m.pill ? p.m.pill.length * 8.6 + 20 : 0;
  const subY = nameY + (p.m.pill ? 50 : 24);
  return (
    <g style={{ opacity: state === 'pending' ? 0.32 : 1, transition: 'opacity 0.4s ease' }}>
      {state === 'active' && (
        <>
          <circle className="scenario-pulse" cx={p.x} cy={p.y} r={R + 4} fill="none" stroke={ACCENT} strokeWidth={4} />
          <circle cx={p.x} cy={p.y} r={R + 7} fill="none" stroke={ACCENT} strokeWidth={4} />
        </>
      )}
      <circle cx={p.x} cy={p.y} r={R} fill={app.color} />
      <Icon x={p.x - 18} y={p.y - 18} width={36} height={36} color={app.ink || '#FFFFFF'} strokeWidth={2} />
      {state === 'done' && (
        <g>
          <circle cx={p.x + 32} cy={p.y - 32} r={13} fill={OK} stroke="#FFFFFF" strokeWidth={3} />
          <path d={`M${p.x + 26},${p.y - 32} l4,4 l8,-8`} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <text x={start} y={nameY} fontSize={20} fontWeight={700} fill={INK}>
        {app.name}
      </text>
      <rect x={start + nameW + 8} y={nameY - 15} width={badgeW} height={20} rx={10} fill="#EEF2F8" />
      <text x={start + nameW + 8 + badgeW / 2} y={nameY} fontSize={13} fontWeight={600} fill="#3C4866" textAnchor="middle">
        {p.m.n}
      </text>
      {p.m.pill && (
        <>
          <rect x={p.x - pillW / 2} y={nameY + 10} width={pillW} height={26} rx={13} fill="#E8EEF8" />
          <text x={p.x} y={nameY + 28} fontSize={15} fontWeight={600} fill="#22406E" textAnchor="middle">
            {p.m.pill}
          </text>
        </>
      )}
      {p.m.sub && (
        <text x={p.x} y={subY} fontSize={16} fill={INK_SOFT} textAnchor="middle">
          {wrap(p.m.sub, wrapAt).map((l, i) => (
            <tspan key={i} x={p.x} dy={i === 0 ? 0 : 20}>
              {l}
            </tspan>
          ))}
        </text>
      )}
    </g>
  );
};

/**
 * One step of the phone layout: the app's round icon, its name and number, the step's label. Drawn in
 * HTML so the text keeps a readable size on a narrow screen, where the SVG would shrink to a few pixels.
 *
 * @param link the dotted line down to the next step: `run` once the run has passed it, `idle` before, none for the last.
 */
const StepRow: React.FC<{ p: Placed; state: State; link?: 'run' | 'idle' }> = ({ p, state, link }) => {
  const app = APPS[p.m.app];
  const Icon = app.icon;
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0" style={{ opacity: state === 'pending' ? 0.32 : 1, transition: 'opacity 0.4s ease' }}>
      {link && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[16.5px] top-10 border-l-[3px] border-dotted"
          style={{ borderColor: link === 'run' ? ACCENT : '#B5BDCC' }}
        />
      )}
      <span
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ background: app.color, boxShadow: state === 'active' ? `0 0 0 3px #F3F5F9, 0 0 0 5.5px ${ACCENT}` : 'none' }}
      >
        <Icon size={18} strokeWidth={2} color={app.ink || '#FFFFFF'} aria-hidden="true" />
        {state === 'done' && (
          <span className="absolute -right-1 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-white" style={{ background: OK }}>
            <Check size={10} strokeWidth={3.5} color="#FFFFFF" aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="flex items-center gap-1.5 text-[15px] font-bold leading-tight" style={{ color: INK }}>
          {app.name}
          <span className="rounded-full px-1.5 text-[11px] font-semibold leading-[18px]" style={{ background: '#EEF2F8', color: '#3C4866' }}>
            {p.m.n}
          </span>
        </span>
        {p.m.pill && (
          <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[12.5px] font-semibold" style={{ background: '#E8EEF8', color: '#22406E' }}>
            {p.m.pill}
          </span>
        )}
        {p.m.sub && (
          <span className="mt-0.5 block text-[14px] leading-snug" style={{ color: INK_SOFT }}>
            {p.m.sub}
          </span>
        )}
      </span>
    </li>
  );
};

/**
 * Exécution animée d'un scénario façon Make : les modules s'allument un par un, une branche
 * différente du If-else à chaque passage, avec un bouton pause. Sur téléphone, la même exécution
 * s'affiche en liste verticale d'étapes, lisible à cette largeur. Sans JavaScript, le schéma complet
 * s'affiche, immobile. Avec « réduire les animations », l'exécution tourne sans le halo qui pulse.
 */
export const ScenarioAnimation: React.FC<{ scenario: ScenarioKey }> = ({ scenario }) => {
  const { s, placed, branches, height, wrapAt } = useMemo(() => layout(scenario), [scenario]);
  const uid = useId().replace(/:/g, '');
  // Observed to run only while visible: the wrapper, since the SVG is not displayed on a phone.
  const box = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0); // module en cours ; placed.length = branche ; au-delà = terminé
  const [branch, setBranch] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const total = placed.length + 1;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.25 });
    if (box.current) io.observe(box.current);
    setRunning(true);
    let k = 0;
    let b = 0;
    let wait = 0;
    const id = setInterval(() => {
      if (pausedRef.current || !inView.current || document.hidden) return;
      if (k < total) k += 1;
      else {
        wait += STEP_MS;
        if (wait < PAUSE_MS) return;
        wait = 0;
        k = 0;
        b = (b + 1) % branches.length;
        setBranch(b);
      }
      setStep(k);
    }, STEP_MS);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [total, branches.length]);

  const stateOf = (i: number): State => (!running ? 'static' : i < step ? 'done' : i === step ? 'active' : 'pending');
  const branchState = (j: number): State => (!running ? 'static' : j !== branch ? 'pending' : stateOf(placed.length));
  const finished = running && step >= total;
  const statusColor = finished ? OK : paused ? '#A7B0C2' : ACCENT;
  const statusText = finished ? 'Exécution terminée' : paused ? 'Exécution en pause' : 'Exécution en cours…';

  return (
    <div ref={box}>
      {/* Phone: the same run as a vertical list of steps, readable at that width. */}
      <div className="overflow-hidden rounded-[12px] sm:hidden" style={{ background: '#F3F5F9' }}>
        <div className="flex items-start justify-between gap-3 border-b bg-white px-4 py-3" style={{ borderColor: '#E6EAF1' }}>
          <span id={`${uid}-m`} className="text-[15px] font-bold leading-snug" style={{ color: INK }}>
            {s.title}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 pt-0.5 text-[12.5px]" style={{ color: INK_SOFT }}>
            {running ? (
              <>
                <span className="h-2 w-2 rounded-full" style={{ background: statusColor }} aria-hidden="true" />
                {statusText}
              </>
            ) : (
              <>
                <Clock size={14} aria-hidden="true" />
                {s.schedule}
              </>
            )}
          </span>
        </div>
        <div className="px-4 py-4">
          <ol aria-labelledby={`${uid}-m`}>
            {placed.map((p, i) => (
              <StepRow key={`l${i}`} p={p} state={stateOf(i)} link={running && i < step ? 'run' : 'idle'} />
            ))}
          </ol>
          {/* The alternatives after the If-else, one taken per run. */}
          <ol
            className="ml-[16.5px] border-l-[3px] border-dotted pl-[22px] pt-4"
            style={{ borderColor: running && step >= placed.length ? ACCENT : '#B5BDCC' }}
          >
            {branches.map((p, j) => (
              <StepRow key={`lb${j}`} p={p} state={branchState(j)} />
            ))}
          </ol>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="hidden h-auto w-full sm:block"
        role="img"
        aria-labelledby={`${uid}-t ${uid}-d`}
        style={{ fontFamily: 'inherit' }}
      >
        <title id={`${uid}-t`}>{s.title}</title>
        <desc id={`${uid}-d`}>{s.description}</desc>
        <defs>
          <clipPath id={`${uid}-clip`}>
            <rect width={W} height={height} rx={18} />
          </clipPath>
          <pattern id={`${uid}-dots`} width={20} height={20} patternUnits="userSpaceOnUse">
            <circle cx={2} cy={2} r={1.4} fill="#CDD4E0" />
          </pattern>
        </defs>
        <g clipPath={`url(#${uid}-clip)`}>
          <rect width={W} height={height} fill="#F3F5F9" />
          <rect y={HEAD} width={W} height={height - HEAD} fill={`url(#${uid}-dots)`} />
          <rect width={W} height={HEAD} fill="#FFFFFF" />
          <line x1={0} x2={W} y1={HEAD} y2={HEAD} stroke="#E6EAF1" />
          <text x={26} y={40} fontSize={21} fontWeight={700} fill={INK}>
            {s.title}
          </text>
          {running ? (
            <g>
              <circle cx={W - 26 - (finished || paused ? 168 : 196)} cy={34} r={6} fill={statusColor} />
              <text x={W - 26} y={40} fontSize={17} fill={INK_SOFT} textAnchor="end">
                {statusText}
              </text>
            </g>
          ) : (
            <g>
              <Clock x={W - 26 - s.schedule.length * 8.4 - 26} y={24} width={18} height={18} color={INK_SOFT} />
              <text x={W - 26} y={40} fontSize={17} fill={INK_SOFT} textAnchor="end">
                {s.schedule}
              </text>
            </g>
          )}

          {/* Links: grey dots, then navy on the path already run */}
          <g fill="none" strokeLinecap="round">
            {[...placed, ...branches].map((p, i) =>
              p.seg ? <path key={`b${i}`} d={p.seg} stroke="#B5BDCC" strokeWidth={4} strokeDasharray="0.1 11" /> : null,
            )}
            {running &&
              placed.map((p, i) =>
                p.seg && i <= step ? <path key={`g${i}`} d={p.seg} stroke={ACCENT} strokeWidth={5} strokeDasharray="0.1 11" /> : null,
              )}
            {running && step >= placed.length && (
              <path d={branches[branch].seg!} stroke={ACCENT} strokeWidth={5} strokeDasharray="0.1 11" />
            )}
          </g>

          {placed.map((p, i) => (
            <Module key={`m${i}`} p={p} state={stateOf(i)} wrapAt={wrapAt} />
          ))}
          {branches.map((p, j) => (
            <Module key={`br${j}`} p={p} state={branchState(j)} wrapAt={wrapAt} />
          ))}
        </g>
      </svg>
      {/* Toujours rendu pour ne rien décaler au chargement ; masqué tant que l'exécution ne tourne pas. */}
      <div className={`mt-2 flex justify-end ${running ? '' : 'invisible'}`}>
        <PauseButton
          paused={paused}
          onToggle={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
          }}
        />
      </div>
    </div>
  );
};
