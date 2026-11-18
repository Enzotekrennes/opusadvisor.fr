'use client';

/**
 * Frame of a calculator on a tool page (/outils/*), around every calculator.
 *
 * - On a phone the fields come before the results, so a strip pinned under the menu bar repeats the main
 *   results while the visitor types. It fades out once the results panel itself is on screen. It is a
 *   visual repeat only (hidden from screen readers): the panel announces each change on its own.
 * - Under the calculator, « Revenir à l'exemple » puts the example values back by mounting the calculator
 *   again with its starting state.
 *
 * Exposes the frame and `useResultsPeek`, the hook a results panel calls to feed the strip.
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

/** One result repeated in the strip: its label and its formatted value. */
export interface PeekItem {
  label: string;
  value: string;
}

interface Channel {
  publish: (items: PeekItem[]) => void;
  setPanelVisible: (visible: boolean) => void;
}

const PeekChannel = createContext<Channel | null>(null);

/**
 * Shares a results panel's main results with the frame's strip, and tells the frame when the panel is on
 * screen. Does nothing outside a CalcFrame.
 *
 * @param items the results to repeat, usually one or two.
 * @param panel the panel's element, watched to hide the strip while the panel itself is visible.
 */
export function useResultsPeek(items: PeekItem[], panel: React.RefObject<HTMLElement | null>): void {
  const channel = useContext(PeekChannel);
  const latest = useRef(items);
  latest.current = items;
  // The values as text: the strip updates when a figure changes, not on every render of the calculator.
  const signature = items.map((i) => `${i.label}=${i.value}`).join('|');

  useEffect(() => {
    channel?.publish(latest.current);
  }, [channel, signature]);

  useEffect(() => {
    const el = panel.current;
    if (!channel || !el) return;
    const io = new IntersectionObserver(([entry]) => channel.setPanelVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [channel, panel]);
}

/** @param children the calculator; mounted again, with its example values, by « Revenir à l'exemple ». */
export const CalcFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PeekItem[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [round, setRound] = useState(0);
  const channel = useMemo<Channel>(() => ({ publish: setItems, setPanelVisible }), []);

  return (
    <PeekChannel.Provider value={channel}>
      {items.length > 0 && (
        <div
          aria-hidden="true"
          className={`sticky top-14 z-10 -mx-5 -mt-5 mb-5 border-b bg-white/95 px-5 py-3 backdrop-blur-md transition-opacity duration-200 lg:hidden ${
            panelVisible ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ borderColor: '#E6EAF1' }}
        >
          <dl className={`grid gap-4 ${items.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {items.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="truncate text-[12.5px] text-[#56627E]">{item.label}</dt>
                <dd className="text-lg font-bold tracking-tight tabular-nums text-[#13213D]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div key={round}>{children}</div>
      <button
        type="button"
        onClick={() => setRound((r) => r + 1)}
        className="mt-6 inline-flex items-center gap-2 py-2.5 text-sm font-semibold text-[#1E3A66] underline decoration-[#1E3A66]/35 underline-offset-4 transition-colors hover:decoration-[#1E3A66]"
      >
        <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
        Revenir à l'exemple
      </button>
    </PeekChannel.Provider>
  );
};
