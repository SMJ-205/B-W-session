"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { playNote } from "@/lib/audio/piano";
import { midiToPitch, toMidi } from "@/lib/music/notation";
import { cn } from "@/lib/utils";

interface VirtualKeyboardProps {
  /** Rentang tuts, default C3 sampai B5 (3 oktaf). */
  from?: string;
  to?: string;
  /** Pitch yang sedang dimainkan oleh partitur (menyala). */
  highlighted?: string[];
  /** Tampilkan nama nada di tuts putih. */
  showLabels?: boolean;
  /** Pakai keyboard laptop (A W S E D …) mulai dari C4. */
  computerKeys?: boolean;
  onPlay?: (pitch: string) => void;
  className?: string;
}

/** Keyboard laptop ke jarak semitone dari C4. */
const KEY_MAP: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11,
  k: 12, o: 13, l: 14, p: 15, ";": 16,
};
const C4 = 60;

export function VirtualKeyboard({
  from = "C3",
  to = "B5",
  highlighted = [],
  showLabels = true,
  computerKeys = true,
  onPlay,
  className,
}: VirtualKeyboardProps) {
  const [pressed, setPressed] = useState<Set<number>>(new Set());
  const onPlayRef = useRef(onPlay);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onPlayRef.current = onPlay;
  }, [onPlay]);

  const keys = useMemo(() => {
    const out: { midi: number; pitch: string; black: boolean }[] = [];
    for (let m = toMidi(from); m <= toMidi(to); m++) {
      const pitch = midiToPitch(m);
      out.push({ midi: m, pitch, black: pitch.includes("#") });
    }
    return out;
  }, [from, to]);

  const highlightedMidi = useMemo(() => new Set(highlighted.map(toMidi)), [highlighted]);
  const whiteCount = keys.filter((k) => !k.black).length;

  // Di layar sempit keyboard bisa digeser; tuts yang menyala selalu dibawa ke tengah.
  const firstLit = highlighted[0];
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !firstLit || scroller.scrollWidth <= scroller.clientWidth) return;
    const el = scroller.querySelector<HTMLElement>(`[data-pitch="${midiToPitch(toMidi(firstLit))}"]`);
    if (!el) return;
    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    if (el.offsetLeft < scroller.scrollLeft || el.offsetLeft + el.offsetWidth > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [firstLit]);

  const triggerRef = useRef((midi: number) => {
    const pitch = midiToPitch(midi);
    void playNote(pitch);
    onPlayRef.current?.(pitch);
    setPressed((s) => new Set(s).add(midi));
    setTimeout(
      () =>
        setPressed((s) => {
          const n = new Set(s);
          n.delete(midi);
          return n;
        }),
      180,
    );
  });

  useEffect(() => {
    if (!computerKeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      const offset = KEY_MAP[e.key.toLowerCase()];
      if (offset !== undefined) triggerRef.current(C4 + offset);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [computerKeys]);

  let whiteIndex = 0;
  return (
    <div
      ref={scrollerRef}
      className={cn("w-full touch-pan-x overflow-x-auto overscroll-x-contain", className)}
      role="group"
      aria-label="Keyboard piano virtual"
    >
      <div className="relative h-44 select-none sm:h-48" style={{ minWidth: `${whiteCount * 40}px` }}>
        {keys.map((k) => {
          const lit = highlightedMidi.has(k.midi) || pressed.has(k.midi);
          if (!k.black) {
            const left = (whiteIndex++ / whiteCount) * 100;
            return (
              <button
                key={k.midi}
                type="button"
                aria-label={k.pitch}
                data-pitch={k.pitch}
                onPointerDown={() => triggerRef.current(k.midi)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && triggerRef.current(k.midi)}
                style={{ left: `${left}%`, width: `calc(${100 / whiteCount}% - 3px)` }}
                className={cn(
                  "key-shape absolute top-0 flex h-full touch-manipulation items-end justify-center pb-2 text-[13px] transition-colors duration-100",
                  lit ? "bg-oxblood text-paper" : "bg-panel text-muted-foreground hover:bg-[#e9e7e7]",
                )}
              >
                {showLabels && k.pitch}
              </button>
            );
          }
          const left = (whiteIndex / whiteCount) * 100 - (100 / whiteCount) * 0.32;
          return (
            <button
              key={k.midi}
              type="button"
              aria-label={k.pitch}
              data-pitch={k.pitch}
              onPointerDown={() => triggerRef.current(k.midi)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && triggerRef.current(k.midi)}
              style={{ left: `${left}%`, width: `${(100 / whiteCount) * 0.6}%` }}
              className={cn(
                "key-shape absolute top-0 z-10 h-[60%] touch-manipulation transition-colors duration-100",
                lit ? "bg-oxblood" : "bg-ink hover:bg-[#3a2a2d]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
