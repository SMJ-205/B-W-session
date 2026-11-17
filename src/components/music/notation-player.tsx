"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetMusic } from "./sheet-music";
import { VirtualKeyboard } from "./virtual-keyboard";
import { playNote, playSequence, type PlaybackHandle } from "@/lib/audio/piano";
import { parseNotation, toMidi } from "@/lib/music/notation";
import type { Clef } from "@/lib/curriculum/types";

interface NotationPlayerProps {
  notation: string;
  clef?: Clef;
  timeSignature?: string;
  initialBpm?: number;
  /** Dipanggil setiap kali notasi selesai diputar sampai akhir. */
  onFinished?: (bpm: number) => void;
}

/** Rentang keyboard yang memuat semua nada di notasi, minimal 2 oktaf. */
function keyboardRange(pitches: string[]): { from: string; to: string } {
  const midis = pitches.map(toMidi);
  let lo = Math.min(...midis, 60);
  let hi = Math.max(...midis, 71);
  lo = lo - (lo % 12); // mulai dari C
  hi = hi + (11 - (hi % 12)); // akhiri di B
  if (hi - lo < 23) hi = lo + 23;
  const name = (m: number) => `${["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][m % 12]}${Math.floor(m / 12) - 1}`;
  return { from: name(lo), to: name(hi) };
}

/**
 * <SheetMusic /> + <VirtualKeyboard /> yang tersinkron: saat Play, Tone.js
 * memainkan tiap not dan menyorot not di partitur serta tuts yang sesuai.
 * Ganti `key` dari luar untuk mereset tempo awal.
 */
export function NotationPlayer({
  notation,
  clef = "treble",
  timeSignature = "4/4",
  initialBpm = 80,
  onFinished,
}: NotationPlayerProps) {
  const notes = useMemo(() => parseNotation(notation), [notation]);
  const range = useMemo(() => keyboardRange(notes.flatMap((n) => n.pitches)), [notes]);
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const handle = useRef<PlaybackHandle | null>(null);
  const finishedRef = useRef(onFinished);

  useEffect(() => {
    finishedRef.current = onFinished;
  }, [onFinished]);
  useEffect(() => () => handle.current?.stop(), []);

  const toggle = async () => {
    if (playing) {
      handle.current?.stop();
      setPlaying(false);
      return;
    }
    setLoading(true);
    try {
      let last = -1;
      handle.current = await playSequence(notes, {
        bpm,
        onStep: (i) => {
          setActive(i);
          if (i === -1) {
            setPlaying(false);
            if (last === notes.length - 1) finishedRef.current?.(bpm);
          }
          last = i;
        },
      });
      setPlaying(true);
    } finally {
      setLoading(false);
    }
  };

  const activePitches = active >= 0 ? (notes[active]?.pitches ?? []) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button onClick={toggle} disabled={loading} variant="accent">
          {playing ? <Pause /> : <Play />}
          {loading ? "Memuat suara piano…" : playing ? "Stop" : "Play"}
        </Button>
        <label className="flex items-center gap-3 text-[15px] text-muted-foreground">
          Tempo
          <input
            type="range"
            min={40}
            max={160}
            step={2}
            value={bpm}
            disabled={playing}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-40 accent-oxblood"
          />
          <span className="tabular w-16 text-ink">{bpm} BPM</span>
        </label>
      </div>

      <SheetMusic
        notation={notation}
        clef={clef}
        timeSignature={timeSignature}
        activeIndex={active}
        onNoteClick={(note, i) => {
          if (!note.pitches.length) return;
          setActive(i);
          void playNote(note.pitches, "4n");
          setTimeout(() => setActive((cur) => (cur === i ? -1 : cur)), 400);
        }}
      />

      <VirtualKeyboard from={range.from} to={range.to} highlighted={activePitches} />
    </div>
  );
}
