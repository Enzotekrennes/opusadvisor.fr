'use client';

import React, { useEffect, useState } from 'react';
import { PauseButton } from '@/components/motion/PauseButton';

/** How far, in px per unit of depth, a plane follows the pointer across the whole hero. */
const PARALLAX_PX = 1;
/** Share of the remaining distance a plane covers each frame: low values make the planes glide. */
const EASING = 0.06;

/**
 * Motion control of the home desktop hero, rendered next to the example's caption.
 *
 * - A Pause / Lecture button (WCAG 2.2.2): sets `data-paused` on the hero, which freezes every
 *   animation inside it. It stays invisible until the script runs, since without JavaScript nothing moves.
 * - Pauses the hero while it is off screen (`data-offscreen`), to spare the processor.
 * - With a mouse, and unless the visitor asks for reduced motion, moves each plane of the town
 *   with the pointer in proportion to its `data-depth`: the nearest planes move the most.
 *
 * @param heroId id of the hero section it controls.
 */
export const DesktopControls: React.FC<{ heroId: string }> = ({ heroId }) => {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setReady(true);
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const visibility = new IntersectionObserver(([entry]) => hero.toggleAttribute('data-offscreen', !entry.isIntersecting));
    visibility.observe(hero);

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (calm || !mouse) return () => visibility.disconnect();

    const planes = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]'));
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let frame = 0;

    const draw = () => {
      current = { x: current.x + (target.x - current.x) * EASING, y: current.y + (target.y - current.y) * EASING };
      for (const plane of planes) {
        const depth = Number(plane.dataset.depth) * PARALLAX_PX;
        plane.style.transform = `translate3d(${(-current.x * depth).toFixed(2)}px, ${(-current.y * depth * 0.5).toFixed(2)}px, 0)`;
      }
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(draw);
    };

    const follow = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      target = { x: (event.clientX - box.left) / box.width - 0.5, y: (event.clientY - box.top) / box.height - 0.5 };
      if (!frame) frame = requestAnimationFrame(draw);
    };

    hero.addEventListener('pointermove', follow);
    return () => {
      visibility.disconnect();
      hero.removeEventListener('pointermove', follow);
      cancelAnimationFrame(frame);
    };
  }, [heroId]);

  useEffect(() => {
    document.getElementById(heroId)?.toggleAttribute('data-paused', paused);
  }, [heroId, paused]);

  return (
    <PauseButton
      paused={paused}
      onToggle={() => setPaused((p) => !p)}
      className={ready ? 'shrink-0' : 'shrink-0 invisible'}
    />
  );
};
