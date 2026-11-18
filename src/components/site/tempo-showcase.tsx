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
        "relative mx-3 mt-[clamp(88px,14vw,220px)] overflow-hidden rounded-[24px] border-[2.5px] border-ink px-5 pt-10 shadow-[4px_4px_0_var(--ink)] transition-colors duration-500 sm:mx-4 md:mx-12 md:px-12 md:pt-14",
        fast ? "bg-oxblood text-surface" : "dotted text-ink",
      )}
    >
      <h2 className="text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-tight font-bold tracking-[-0.03em]">
        Hari ini {bpm} BPM, {fast ? "cepat" : "pelan"}.
      </h2>
      <p className="mt-3 max-w-[44ch] text-[17px] leading-[1.55]">
        Latihan scale C mayor di Level 6 mulai dari {L6.drill.bpm_start} BPM, lalu naik sampai{" "}
        {L6.drill.bpm_goal} BPM dalam empat minggu. Coba geser temponya, lalu dengarkan bedanya!
      </p>

      {/* Kontrol asli dalam satuan em, dibesarkan lewat font-size */}
      <div
        data-ui
        className="mt-10 mb-[-0.4em] text-[clamp(26px,7.4vw,34px)] md:mt-[-0.4em] md:mr-[-2.4em] md:ml-auto md:w-fit md:text-[clamp(44px,5vw,80px)]"
      >
        <div
          className={cn(
            "flex w-full flex-col gap-[0.5em] rounded-[0.35em] p-[0.6em] md:w-[14em]",
            "border-[2.5px] border-ink bg-surface text-ink shadow-[4px_4px_0_var(--ink)]",
          )}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="tempo-big" className="text-[0.45em] font-semibold">
              Tempo
            </label>
            <span className="tabular text-[0.9em] leading-none font-bold">{bpm} BPM</span>
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
            className={cn(
              "press flex h-[1.4em] touch-manipulation rounded-[0.3em] border-2 border-ink items-center justify-center gap-[0.25em] text-[0.5em] font-semibold transition-colors max-md:h-11 max-md:text-[16px]",
              "bg-lit text-ink shadow-[2px_2px_0_var(--ink)]",
            )}
          >
            {playing ? <Pause className="size-[0.8em]" /> : <Play className="size-[0.8em]" />}
            {playing ? "Stop" : "Dengarkan scale C mayor"}
          </button>
        </div>
      </div>
    </section>
  );
}
