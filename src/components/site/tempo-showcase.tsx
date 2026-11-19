"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { playSequence, type PlaybackHandle } from "@/lib/audio/piano";
import { parseNotation } from "@/lib/music/notation";
import { SEED_CURRICULUM } from "@/lib/curriculum/seed";
import { cn } from "@/lib/utils";

const L6 = SEED_CURRICULUM[5];
const DRILL = parseNotation(L6.drill.notation);
const FAST = 90;

/**
 * Satu kontrol dari produk, dibesarkan: penggeser tempo latihan harian.
 * Tempo di atas 90 BPM mengganti warna bidang dan satu kata di judul.
 */
export function TempoShowcase() {
  const [bpm, setBpm] = useState(L6.drill.bpm_start);
  const [playing, setPlaying] = useState(false);
  const handle = useRef<PlaybackHandle | null>(null);
  const fast = bpm >= FAST;

  const toggle = async () => {
    if (playing) {
      handle.current?.stop();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    handle.current = await playSequence(DRILL, { bpm, onStep: (i) => i === -1 && setPlaying(false) });
  };

  return (
    <section
      className={cn(
        "mx-3 mt-[clamp(88px,14vw,220px)] grid items-center gap-8 overflow-hidden rounded-[24px] border-[2.5px] border-ink px-5 py-10 shadow-[4px_4px_0_var(--ink)] transition-colors duration-500 sm:mx-4 sm:px-8 md:mx-12 md:px-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12",
        fast ? "bg-oxblood text-surface" : "dotted text-ink",
      )}
    >
      <div>
        <h2 className="text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-tight font-bold tracking-[-0.03em]">
          Hari ini {bpm} BPM, {fast ? "cepat" : "pelan"}.
        </h2>
        <p className="mt-3 max-w-[44ch] text-[17px] leading-[1.55]">
          Latihan scale C mayor di Level 6 mulai dari {L6.drill.bpm_start} BPM, lalu naik sampai{" "}
          {L6.drill.bpm_goal} BPM dalam empat minggu. Coba geser temponya, lalu dengarkan bedanya!
        </p>
      </div>

      {/* Kontrol asli dalam satuan em; ukurannya mengikuti font-size dan selalu utuh di kolomnya */}
      <div data-ui className="min-w-0 text-[clamp(28px,7vw,40px)] lg:text-[clamp(40px,3.6vw,60px)]">
        <div className="flex w-full flex-col gap-[0.5em] rounded-[0.35em] border-[2.5px] border-ink bg-surface p-[0.6em] text-ink shadow-[4px_4px_0_var(--ink)]">
          <div className="flex items-baseline justify-between gap-[0.3em]">
            <label htmlFor="tempo-big" className="text-[0.45em] font-semibold">
              Tempo
            </label>
            <span className="tabular text-[0.9em] leading-none font-bold whitespace-nowrap">{bpm} BPM</span>
          </div>
          <input
            id="tempo-big"
            type="range"
            min={40}
            max={140}
            step={2}
            value={bpm}
            disabled={playing}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="tempo-range w-full"
            style={{ "--fill": `${((bpm - 40) / 100) * 100}%` } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={toggle}
            className="press flex h-[1.4em] min-h-11 touch-manipulation items-center justify-center gap-[0.25em] rounded-[0.3em] border-2 border-ink bg-lit text-[0.5em] font-semibold text-ink shadow-[2px_2px_0_var(--ink)] max-md:text-[16px]"
          >
            {playing ? <Pause className="size-[0.8em] max-md:size-4" /> : <Play className="size-[0.8em] max-md:size-4" />}
            {playing ? "Stop" : "Dengarkan scale C mayor"}
          </button>
        </div>
      </div>
    </section>
  );
}
