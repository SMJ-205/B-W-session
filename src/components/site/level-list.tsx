import Image from "next/image";
import { SEED_CURRICULUM } from "@/lib/curriculum/seed";
import { TIERS } from "@/lib/curriculum/types";

/** Foto bullet: dipakai bergiliran, dipotong ke bentuk tuts. */
const BULLETS = [
  { src: "/media/pianolesson-1897.jpg", pos: "62% 55%" },
  { src: "/media/metronome.jpg", pos: "50% 30%" },
  { src: "/media/piano-hammers.jpg", pos: "60% 70%" },
  { src: "/media/steinway-interior.jpg", pos: "20% 70%" },
  { src: "/media/piano-lesson-1873.jpg", pos: "75% 40%" },
];

const BULLET_ALT: Record<string, string> = {
  "/media/pianolesson-1897.jpg": "Potongan lukisan The Pianolesson karya Henriëtte Ronner-Knip, 1897",
  "/media/metronome.jpg": "Metronom kayu dengan bandul berayun",
  "/media/piano-hammers.jpg": "Hammer piano berlapis felt",
  "/media/steinway-interior.jpg": "Dawai dan felt merah di dalam grand piano",
  "/media/piano-lesson-1873.jpg": "Potongan lukisan Lezione di pianoforte, 1873",
};

export function LevelList() {
  const tiers = Object.entries(TIERS).map(([tier, name]) => {
    const modules = SEED_CURRICULUM.filter((m) => m.tier === Number(tier));
    return { name, modules, weeks: modules.reduce((n, m) => n + m.duration_weeks, 0) };
  });

  return (
    <section id="kurikulum" className="scroll-mt-6 px-4 pt-[clamp(96px,14vw,200px)] md:px-12">
      <div className="grid items-end gap-10 md:grid-cols-2">
        <div>
          <h2
            data-reveal
            className="text-[length:var(--step-head)] leading-[1] font-bold tracking-[-0.035em] text-oxblood"
          >
            12 level dalam 45 minggu
          </h2>
          <p
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-6 max-w-[46ch] font-serif text-[length:var(--step-lead)] leading-[1.45] text-oxblood"
          >
            Setiap level punya satu target untuk tiap minggu dan satu latihan harian yang temponya naik sedikit
            demi sedikit. Level berikutnya terbuka setelah kuis di level sebelumnya lulus.
          </p>
        </div>
        <figure data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          <video
            className="aspect-video w-full rounded-[4px_4px_32px_32px] bg-ink object-cover grayscale-[0.7]"
            src="/media/square-piano-loop.webm"
            poster="/media/square-piano-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="Tangan pemain di atas tuts square piano antik, dengan partitur di depannya"
          />
          <figcaption className="mt-2 text-[13px] text-oxblood-soft">
            Jan Waterfield memainkan square piano buatan Andrew Rochead, Edinburgh, sekitar 1815
          </figcaption>
        </figure>
      </div>

      {tiers.map(({ name, modules, weeks }) => (
        <div key={name}>
          <div className="mt-24 mb-10 flex items-baseline justify-between gap-4" data-reveal>
            <h3 className="text-[length:var(--step-head)] leading-none font-bold tracking-[-0.03em] text-oxblood">
              {name}
            </h3>
            <span className="tabular text-[16px] text-oxblood-soft">
              {modules.length} level, {weeks} minggu
            </span>
          </div>
          <ul className="grid gap-x-16 gap-y-9 md:grid-cols-2">
            {modules.map((m, i) => {
              const b = BULLETS[(m.level - 1) % BULLETS.length];
              return (
                <li
                  key={m.id}
                  data-reveal
                  style={{ "--i": i } as React.CSSProperties}
                  className="flex gap-5"
                >
                  <Image
                    src={b.src}
                    alt={BULLET_ALT[b.src]}
                    width={64}
                    height={88}
                    sizes="64px"
                    style={{ objectPosition: b.pos }}
                    className="key-shape h-[88px] w-[52px] shrink-0 object-cover grayscale-[0.7] md:w-16"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-3 text-[17px] font-bold text-oxblood">
                      <span>{m.title}</span>
                      <span className="tabular shrink-0 font-normal">{m.duration_weeks} minggu</span>
                    </p>
                    <p className="mt-1 max-w-[42ch] font-serif text-[16px] leading-[1.5] text-oxblood">
                      {m.description}
                    </p>
                    <p className="mt-1.5 text-[16px] font-semibold text-oxblood-soft">
                      Level {m.level}, {m.daily_minutes} menit sehari
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
