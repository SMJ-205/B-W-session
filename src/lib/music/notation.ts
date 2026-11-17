/**
 * Parser notasi sederhana untuk pelajaran.
 *
 * Format: daftar token dipisah koma, mis. "C4/q, D4/q, E4/h, R/q, C#4/8, Bb3/w, (C4 E4 G4)/h".
 *   - Nada:   huruf A-G + aksidental opsional (# atau b) + oktaf (0-8)
 *   - Chord:  beberapa nada dalam kurung, dipisah spasi: "(C4 E4 G4)/h"
 *   - R:      rest (tanda istirahat)
 *   - Durasi: w (whole), h (half), q (quarter), 8 (eighth), 16 (sixteenth);
 *             tambahkan "d" untuk dotted, mis. "C4/hd"
 */

export type DurationCode = "w" | "h" | "q" | "8" | "16";

export interface ParsedNote {
  /** Nada yang berbunyi bersamaan, mis. ["C4", "E4", "G4"]. Kosong jika rest. */
  pitches: string[];
  duration: DurationCode;
  dotted: boolean;
  /** Panjang dalam ketukan (quarter = 1). */
  beats: number;
}

const BEATS: Record<DurationCode, number> = {
  w: 4,
  h: 2,
  q: 1,
  "8": 0.5,
  "16": 0.25,
};

const PITCH_RE = /^([A-Ga-g])([#b]?)([0-8])$/;
const TOKEN_RE = /^(R|\(([^)]+)\)|[A-Ga-g][#b]?[0-8])\/(w|h|q|8|16)(d?)$/;

function normalizePitch(raw: string): string {
  const m = PITCH_RE.exec(raw.trim());
  if (!m) throw new Error(`Nada tidak valid: "${raw}"`);
  return `${m[1].toUpperCase()}${m[2]}${m[3]}`;
}

export function parseNotation(input: string): ParsedNote[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((token) => {
      const m = TOKEN_RE.exec(token);
      if (!m) throw new Error(`Token notasi tidak valid: "${token}"`);
      const [, head, chord, dur, dot] = m;
      const duration = dur as DurationCode;
      const dotted = dot === "d";
      const pitches =
        head === "R" ? [] : chord ? chord.trim().split(/\s+/).map(normalizePitch) : [normalizePitch(head)];
      return { pitches, duration, dotted, beats: BEATS[duration] * (dotted ? 1.5 : 1) };
    });
}

/** "C#4" -> "c#/4" (format key VexFlow). */
export function toVexKey(pitch: string): string {
  const m = /^([A-G])([#b]?)(\d)$/.exec(pitch);
  if (!m) throw new Error(`Pitch tidak valid: ${pitch}`);
  return `${m[1].toLowerCase()}${m[2]}/${m[3]}`;
}

const SEMITONE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

/** Nomor MIDI, dipakai untuk mencocokkan tuts keyboard (enharmonik aman). */
export function toMidi(pitch: string): number {
  const m = /^([A-G])([#b]?)(\d)$/.exec(pitch);
  if (!m) throw new Error(`Pitch tidak valid: ${pitch}`);
  const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  return (Number(m[3]) + 1) * 12 + SEMITONE[m[1]] + acc;
}

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToPitch(midi: number): string {
  return `${SHARP_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

const SOLFEGE = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
const ANGKA = ["1", "1#", "2", "2#", "3", "4", "4#", "5", "5#", "6", "6#", "7"];

/** Nama nada dalam tiga sistem: huruf (C4), solmisasi (Do), dan not angka (1). */
export function describePitch(pitch: string) {
  const midi = toMidi(pitch);
  return {
    letter: midiToPitch(midi),
    solfege: SOLFEGE[midi % 12],
    angka: ANGKA[midi % 12],
  };
}
