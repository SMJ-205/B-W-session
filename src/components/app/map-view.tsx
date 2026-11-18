"use client";

import Link from "next/link";
import { Lock, Star } from "lucide-react";
import { useLearner } from "./use-learner";
import { TIERS } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

export function MapView() {
  const { state, derived: d } = useLearner();

  if (!state || !d) {
    return <div className="mx-auto max-w-[1100px] px-6 py-16 text-muted-foreground">Memuat peta level…</div>;
  }

  const tiers = Object.entries(TIERS).map(([tier, name]) => ({
    name,
    modules: state.curriculum.filter((m) => m.tier === Number(tier)),
  }));

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-20 sm:px-6 md:pt-[72px]">
      <header data-reveal className="max-w-[820px]">
        <h1 className="text-[26px] leading-tight font-bold text-ink md:text-[32px]">Peta level</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-ink">
          Ada 12 level, totalnya {d.total} minggu. Selesaikan semua pelajaran dan kuis di satu level, lalu level
          berikutnya terbuka. Gembok berarti level itu belum terbuka.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {tiers.map(({ name, modules }) => (
          <section key={name} aria-labelledby={`tier-${name}`}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id={`tier-${name}`} className="text-[20px] font-bold text-ink">
                {name}
              </h2>
              <span className="tabular text-[13px] text-muted-foreground">
                {modules.reduce((n, m) => n + m.duration_weeks, 0)} minggu
              </span>
            </div>
            <ol className="space-y-3">
              {modules.map((m) => {
                const start = d.starts.get(m.id) ?? 1;
                const end = start + m.duration_weeks - 1;
                const open = d.unlocked.has(m.id);
                const isCurrent = m.id === d.current.id;
                const done = m.lessons.filter((l) => state.completed.has(l.id)).length;
                return (
                  <li
                    key={m.id}
                    id={`level-${m.level}`}
                    data-reveal
                    className={cn(
                      "sticker scroll-mt-16 p-4 sm:p-5",
                      !open && "opacity-75",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[18px] font-bold text-ink">
                        {m.level}. {m.title}
                      </h3>
                      {!open && <Lock className="size-3.5 text-muted-foreground" aria-label="Terkunci" />}
                      {isCurrent && (
                        <span className="rounded-full border-2 border-ink bg-hi px-2.5 py-0.5 text-[12px] font-bold text-ink">
                          Sedang berjalan
                        </span>
                      )}
                      <span className="tabular basis-full text-[13px] text-muted-foreground sm:ml-auto sm:basis-auto">
                        Minggu {start}
                        {end > start && ` sampai ${end}`} · {m.daily_minutes} menit sehari · {done}/{m.lessons.length}{" "}
                        pelajaran
                      </span>
                    </div>
                    <p className="mt-1 text-[15px] text-muted-foreground">{m.description}</p>

                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-[13px] font-bold text-muted-foreground">Misi tiap minggu</h4>
                        <ol className="space-y-2">
                          {m.weekly_targets.map((t, i) => (
                            <li key={i} className="flex gap-3 text-[15px] leading-snug text-ink">
                              <span className="tabular w-[4.5rem] shrink-0 whitespace-nowrap text-muted-foreground">Minggu {start + i}</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="mb-2 text-[13px] font-bold text-muted-foreground">Pelajaran</h4>
                        <ul className="space-y-1">
                          {m.lessons.map((l) => {
                            const lessonDone = state.completed.has(l.id);
                            const row = (
                              <>
                                {lessonDone ? (
                                  <Star className="size-4 shrink-0 text-lit" fill="currentColor" aria-label="Selesai" />
                                ) : (
                                  <span className="inline-block size-4 shrink-0 rounded-[5px] border-2 border-ink bg-surface" aria-hidden="true" />
                                )}
                                <span className="flex-1">{l.title}</span>
                                {l.content_type === "quiz" && <span className="text-[13px] text-muted-foreground">Kuis</span>}
                              </>
                            );
                            return (
                              <li key={l.id}>
                                {open ? (
                                  <Link
                                    href={`/lessons/${l.id}`}
                                    className="flex min-h-11 items-center gap-2.5 rounded-[12px] px-2 py-1.5 text-[15px] text-ink hover:bg-hi active:bg-hi"
                                  >
                                    {row}
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-2.5 px-2 py-1.5 text-[15px] text-muted-foreground">
                                    {row}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
