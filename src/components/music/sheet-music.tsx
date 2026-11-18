"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseNotation, toVexKey, type ParsedNote } from "@/lib/music/notation";
import type { Clef } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

interface SheetMusicProps {
  /** Notasi string, mis. "C4/q, D4/q, (C4 E4 G4)/h". */
  notation: string;
  clef?: Clef;
  timeSignature?: string;
  /** Index not yang sedang dimainkan (-1 = tidak ada). */
  activeIndex?: number;
  onNoteClick?: (note: ParsedNote, index: number) => void;
  /** Lebar minimum satu birama sebelum pindah baris. */
  minMeasureWidth?: number;
  className?: string;
}

const ACTIVE_COLOR = "#8b5a2b"; // mahogany: not yang sedang dimainkan
const INK_COLOR = "#2c2a29";

/** Ketukan (dalam quarter note) per birama, mis. "3/4" -> 3, "6/8" -> 3. */
function beatsPerMeasure(timeSignature: string): number {
  const [n, d] = timeSignature.split("/").map(Number);
  return (n * 4) / d;
}

function toMeasures(notes: ParsedNote[], perMeasure: number) {
  const measures: { note: ParsedNote; index: number }[][] = [[]];
  let beats = 0;
  notes.forEach((note, index) => {
    if (beats >= perMeasure - 1e-6) {
      measures.push([]);
      beats = 0;
    }
    measures[measures.length - 1].push({ note, index });
    beats += note.beats;
  });
  return measures;
}

/**
 * Notasi balok dengan VexFlow (SVG). Responsif: jumlah birama per baris
 * mengikuti lebar container. Not bisa diklik dan disorot.
 */
export function SheetMusic({
  notation,
  clef = "treble",
  timeSignature = "4/4",
  activeIndex = -1,
  onNoteClick,
  minMeasureWidth = 230,
  className,
}: SheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteEls = useRef<(SVGElement | undefined)[]>([]);
  const clickRef = useRef(onNoteClick);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clickRef.current = onNoteClick;
  }, [onNoteClick]);

  const notes = useMemo(() => {
    try {
      return parseNotation(notation);
    } catch {
      return null;
    }
  }, [notation]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !width || !notes) return;
    let cancelled = false;

    (async () => {
      const VF = await import("vexflow/bravura");
      await document.fonts.load("30px Bravura");
      if (cancelled) return;
      el.innerHTML = "";
      noteEls.current = [];

      const perMeasure = beatsPerMeasure(timeSignature);
      const [num, den] = timeSignature.split("/").map(Number);
      const measures = toMeasures(notes, perMeasure);
      // Di layar sempit dua birama tetap muat per baris.
      const minWidth = width < 480 ? Math.min(minMeasureWidth, 160) : minMeasureWidth;
      const perRow = Math.max(1, Math.floor(width / minWidth));
      const rows = Math.ceil(measures.length / perRow);
      const rowHeight = width < 480 ? 116 : 130;

      const renderer = new VF.Renderer(el as HTMLDivElement, VF.Renderer.Backends.SVG);
      renderer.resize(width, rows * rowHeight + 10);
      const ctx = renderer.getContext();
      ctx.setFillStyle(INK_COLOR);
      ctx.setStrokeStyle(INK_COLOR);

      measures.forEach((measure, mi) => {
        const col = mi % perRow;
        const row = Math.floor(mi / perRow);
        // Baris terakhir yang tidak penuh direntangkan selebar container,
        // supaya tidak ada birama yang tertinggal sendirian dengan ruang kosong.
        const inThisRow = Math.min(perRow, measures.length - row * perRow);
        const measureWidth = (width - 2) / inThisRow;
        const stave = new VF.Stave(1 + col * measureWidth, row * rowHeight, measureWidth);
        if (col === 0) stave.addClef(clef);
        if (mi === 0) stave.addTimeSignature(timeSignature);
        if (mi === measures.length - 1) stave.setEndBarType(VF.Barline.type.END);
        stave.setContext(ctx).draw();

        const staveNotes = measure.map(({ note }) => {
          const rest = note.pitches.length === 0;
          const sn = new VF.StaveNote({
            clef,
            keys: rest ? [clef === "bass" ? "d/3" : "b/4"] : note.pitches.map(toVexKey),
            duration: note.duration + (rest ? "r" : ""),
            dots: note.dotted ? 1 : 0,
            autoStem: true,
          });
          if (note.dotted) VF.Dot.buildAndAttach([sn], { all: true });
          return sn;
        });

        const voice = new VF.Voice({ numBeats: num, beatValue: den }).setStrict(false);
        voice.addTickables(staveNotes);
        VF.Accidental.applyAccidentals([voice], "C");
        const beams = VF.Beam.generateBeams(staveNotes);
        new VF.Formatter()
          .joinVoices([voice])
          .format([voice], stave.getNoteEndX() - stave.getNoteStartX() - 12);
        voice.draw(ctx, stave);
        beams.forEach((b) => b.setContext(ctx).draw());

        staveNotes.forEach((sn, i) => {
          const { note, index } = measure[i];
          const g = sn.getSVGElement();
          noteEls.current[index] = g;
          if (g && note.pitches.length) {
            g.style.cursor = "pointer";
            g.setAttribute("role", "button");
            g.setAttribute("aria-label", `Bunyikan ${note.pitches.join(" ")}`);
            g.addEventListener("click", () => clickRef.current?.(note, index));
          }
        });
      });
      setError(null);
    })().catch((e: unknown) => {
      if (!cancelled) setError(e instanceof Error ? e.message : String(e));
    });

    return () => {
      cancelled = true;
    };
  }, [notes, width, clef, timeSignature, minMeasureWidth]);

  useEffect(() => {
    noteEls.current.forEach((g, i) => {
      if (!g) return;
      const color = i === activeIndex ? ACTIVE_COLOR : "";
      g.querySelectorAll<SVGElement>("path, text").forEach((p) => {
        p.style.fill = color;
        p.style.stroke = color;
      });
    });
  }, [activeIndex, width, notes]);

  if (!notes) {
    return <p className="text-sm text-destructive">Notasi tidak valid: {notation}</p>;
  }

  return (
    <div className={cn("w-full overflow-hidden bg-surface", className)}>
      <div ref={containerRef} className="w-full" aria-label="Notasi balok" />
      {error && <p className="text-sm text-destructive">Partitur gagal ditampilkan: {error}</p>}
    </div>
  );
}
