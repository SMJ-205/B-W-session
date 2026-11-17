"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import { SheetMusic } from "@/components/music/sheet-music";
import { VirtualKeyboard } from "@/components/music/virtual-keyboard";
import { SEED_CURRICULUM } from "@/lib/curriculum/seed";
import { cn } from "@/lib/utils";

const L2 = SEED_CURRICULUM[1];
const TWINKLE = L2.lessons.find((l) => l.title.startsWith("Twinkle"))!;

const STAGES = [
  { name: "Pemanasan", clause: "Pemanasan lima menit" },
  { name: "Pelajaran", clause: "Satu pelajaran baru" },
  { name: "Main sendiri", clause: "Mainkan sendiri" },
  { name: "Target", clause: "Centang target minggu ini" },
];

/** Potongan antarmuka asli untuk tiap tahap (data-ui). */
function Fragment({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <div data-ui className="w-full max-w-[440px] rounded-xl bg-white p-5 text-ink">
        <p className="text-[13px] font-semibold">Latihan hari ini</p>
        <p className="mt-3 text-[20px] font-semibold">{L2.drill.title}</p>
        <p className="tabular mt-1 text-[16px] text-muted-foreground">
          {L2.drill.bpm_start + 4} BPM hari ini, naik ke {L2.drill.bpm_goal} BPM
        </p>
        <div className="mt-4 grid grid-cols-7 gap-1">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "key-shape h-9 w-full",
                  i < 2 ? "bg-ink" : i === 2 ? "bg-[#e6e3e3] outline-2 -outline-offset-2 outline-oxblood" : "bg-panel",
                )}
              />
              <span className="text-[12px] text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>
        <div className="key-shape mt-5 flex h-11 items-center justify-center gap-2 bg-ink text-[16px] font-semibold text-white">
          <Play className="size-4" /> Mulai latihan
        </div>
      </div>
    );
  if (stage === 1)
    return (
      <div data-ui className="w-full max-w-[440px] rounded-xl bg-white p-5 text-ink">
        <p className="text-[13px] text-muted-foreground">Level 2, minggu 2</p>
        <p className="mt-1 text-[20px] font-semibold">{TWINKLE.title}</p>
        <SheetMusic
          notation="C4/q, C4/q, G4/q, G4/q, A4/q, A4/q, G4/h"
          minMeasureWidth={190}
          className="mt-3"
        />
      </div>
    );
  if (stage === 2)
    return (
      <div data-ui className="w-full max-w-[440px] rounded-xl bg-white p-5 text-ink">
        <p className="mb-4 text-[13px] font-semibold">Coba di keyboard</p>
        <VirtualKeyboard from="C4" to="B4" computerKeys={false} className="[&>div]:h-36 [&>div]:min-w-0" />
      </div>
    );
  return (
    <div data-ui className="w-full max-w-[440px] rounded-xl bg-white p-5 text-ink">
      <p className="text-[13px] font-semibold">Target minggu ini</p>
      <p className="mt-3 font-serif text-[17px] leading-[1.5]">{L2.weekly_targets[1]}</p>
      <ul className="mt-4 space-y-2 text-[16px]">
        {L2.lessons
          .filter((l) => l.week === 2)
          .map((l, i) => (
            <li key={l.id} className="flex items-center gap-2">
              {i === 0 ? (
                <Check className="size-4" />
              ) : (
                <span className="key-shape inline-block h-4 w-2.5 bg-oxblood" />
              )}
              {l.title}
            </li>
          ))}
      </ul>
    </div>
  );
}

export function Stages() {
  const [stage, setStage] = useState(0);

  return (
    <section id="cara" className="mt-[clamp(120px,14vw,220px)] scroll-mt-0">
      <div className="grid md:min-h-[88svh] md:grid-cols-2">
        <div className="order-2 flex flex-col bg-oxblood px-4 pt-10 pb-8 text-paper md:order-1 md:px-12 md:pt-14">
          <h2
            key={stage}
            className="animate-in fade-in text-[length:var(--step-head)] leading-[0.98] font-bold tracking-[-0.035em] duration-200"
          >
            {STAGES[stage].clause}
          </h2>
          <p className="mt-6 max-w-[40ch] font-serif text-[length:var(--step-body)] leading-[1.55]">
            Satu sesi butuh 15 sampai 30 menit, tergantung level. Urutannya selalu sama, jadi kamu tidak perlu
            memikirkan harus mulai dari mana.
          </p>
        </div>
        <div className="order-1 flex min-h-[46svh] items-center justify-center bg-paper-2 px-4 py-10 md:order-2 md:px-12">
          <div key={stage} className="animate-in fade-in flex w-full justify-center duration-200">
            <Fragment stage={stage} />
          </div>
        </div>
      </div>

      <div className="bg-paper px-4 pt-6 pb-8 md:px-12">
        <label htmlFor="stage-range" className="sr-only">
          Tahap sesi latihan
        </label>
        <input
          id="stage-range"
          type="range"
          min={0}
          max={3}
          step={1}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          aria-valuetext={STAGES[stage].name}
          className="stage-range w-full"
          style={{ "--fill": `${(stage / 3) * 100}%` } as React.CSSProperties}
        />
        <ol className="mt-4 grid grid-cols-2 gap-y-2 text-[16px] md:grid-cols-4">
          {STAGES.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => setStage(i)}
                className={cn(
                  "text-left transition-colors hover:text-oxblood",
                  i === stage ? "font-bold text-oxblood" : "text-oxblood-soft",
                )}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
