"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SheetMusic } from "@/components/music/sheet-music";
import { Panel, Tile } from "./panel";
import { WeekStrip } from "./week-strip";
import { WeekTimeline } from "./week-timeline";
import { formatDate, useLearner } from "./use-learner";
import { TIERS } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

function Finding({ weeksBehind, planWeek, plannedLevel }: { weeksBehind: number; planWeek: number; plannedLevel: number }) {
  if (weeksBehind > 0)
    return (
      <>
        Kalender sudah masuk minggu ke-{planWeek} (Level {plannedLevel}); kamu tertinggal {weeksBehind} minggu dari
        rencana.
      </>
    );
  if (weeksBehind < 0) return <>Kamu {-weeksBehind} minggu lebih cepat dari rencana kalender.</>;
  return <>Sesuai rencana kalender.</>;
}

export function DashboardView() {
  const { state, derived: d } = useLearner();

  if (!state || !d) {
    return <div className="mx-auto max-w-[1100px] px-6 py-16 text-muted-foreground">Memuat jadwal belajar…</div>;
  }

  const { current } = d;
  const nextLesson = current.lessons.find((l) => !state.completed.has(l.id));
  const nextModule = state.curriculum.find((m) => m.level === current.level + 1);
  const doneInLevel = current.lessons.filter((l) => state.completed.has(l.id)).length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-20 sm:px-6 md:pt-[72px]">
      <header data-reveal className="max-w-[820px]">
        <h1 className="font-serif text-[28px] leading-[1.15] font-semibold text-ink md:text-[32px]">
          Minggu ke-{d.actualWeek} dari {d.total}, Level{"\u00a0"}{current.level}.
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">
          <Finding weeksBehind={d.weeksBehind} planWeek={d.planWeek} plannedLevel={d.planned.level} />{" "}
          <span className="text-muted-foreground">
            {formatDate(state.today)}. Mulai belajar {formatDate(state.startedOn, true)}.
          </span>
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 md:mt-[50px] md:gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Tile
            label="Level"
            value={<>{current.level} <span className="text-muted-foreground">dari 12</span></>}
            caption={`${TIERS[current.tier]}: ${current.title}`}
          />
        </div>
        <div className="lg:col-span-3">
          <Tile
            label="Minggu di level ini"
            value={<>{d.week} <span className="text-muted-foreground">dari {current.duration_weeks}</span></>}
            caption={`${current.daily_minutes} menit latihan sehari`}
          />
        </div>
        <div className="lg:col-span-3">
          <Tile
            label="Streak"
            value={`${d.streak} hari`}
            caption={d.todayEntry ? `Hari ini sudah latihan, ${d.todayEntry.bpm} BPM` : "Hari ini belum latihan"}
          />
        </div>
        <div className="lg:col-span-3">
          <Tile
            label="Pelajaran selesai"
            value={<>{d.lessonsDone} <span className="text-muted-foreground">dari {d.lessonsTotal}</span></>}
            caption={`${doneInLevel} dari ${current.lessons.length} di level ini`}
          />
        </div>

        <Panel
          title="Latihan hari ini"
          chip={`sesi ${d.sessionsInLevel + (d.todayEntry ? 0 : 1)} dari ${d.sessionsGoal}`}
          className="col-span-2 lg:col-span-9"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="min-w-0">
              <p className="text-[20px] leading-snug font-semibold text-ink">{current.drill.title}</p>
              <p className="tabular mt-1 text-[15px] text-muted-foreground">
                {d.bpmToday} BPM hari ini, naik bertahap ke {current.drill.bpm_goal} BPM di akhir level
              </p>
              <SheetMusic
                notation={current.drill.notation}
                clef={current.drill.clef}
                className="mt-4 rounded-lg px-2 pt-2"
                minMeasureWidth={200}
              />
            </div>
            <div className="flex flex-col gap-5">
              <WeekStrip practice={state.practice} today={state.today} />
              <Link href="/latihan" className={cn(buttonVariants({ size: "lg" }), "mt-auto w-full")}>
                {d.todayEntry ? "Latihan lagi" : "Mulai latihan"}
              </Link>
            </div>
          </div>
        </Panel>

        <Panel title="Target minggu ini" className="col-span-2 lg:col-span-3">
          <p className="font-serif text-[17px] leading-[1.5] text-ink">{current.weekly_targets[d.week - 1]}</p>
          {d.lessonsThisWeek.length > 0 && (
            <ul className="mt-4 space-y-2">
              {d.lessonsThisWeek.map((l) => {
                const done = state.completed.has(l.id);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/lessons/${l.id}`}
                      className="flex items-start gap-2 text-[15px] leading-snug text-ink hover:underline"
                    >
                      {done ? (
                        <Check className="mt-0.5 size-4 text-ink" aria-label="Selesai" />
                      ) : (
                        <span className="key-shape mt-0.5 inline-block h-4 w-2.5 shrink-0 bg-oxblood" aria-hidden="true" />
                      )}
                      <span className={cn(done && "text-muted-foreground")}>{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Timeline 45 minggu"
          chip={`${Math.round(((d.actualWeek - 1) / d.total) * 100)}% lewat`}
          link={{ href: "/peta", label: "Peta level" }}
          className="col-span-2 lg:col-span-12"
          white
        >
          <WeekTimeline curriculum={state.curriculum} starts={d.starts} actualWeek={d.actualWeek} planWeek={d.planWeek} />
        </Panel>

        <Panel
          title={`Pelajaran Level ${current.level}`}
          chip={`${doneInLevel}/${current.lessons.length}`}
          className="col-span-2 lg:col-span-6"
        >
          <ul className="space-y-2">
            {current.lessons.map((l) => {
              const done = state.completed.has(l.id);
              const isNext = l.id === nextLesson?.id;
              return (
                <li key={l.id}>
                  <Link
                    href={`/lessons/${l.id}`}
                    className={cn(
                      "flex min-h-[63px] items-center gap-3 rounded-lg border px-4 transition-colors",
                      isNext ? "border-oxblood/40 bg-white" : "border-[#e6e3e3] bg-[#f9f8f8] hover:bg-white",
                    )}
                  >
                    <span className="tabular w-16 shrink-0 text-[13px] text-muted-foreground">Minggu {l.week}</span>
                    <span className="flex-1 text-[15px] text-ink">{l.title}</span>
                    {done ? (
                      <Check className="size-4 text-ink" aria-label="Selesai" />
                    ) : isNext ? (
                      <span className="text-[13px] font-medium text-oxblood">Berikutnya</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        {nextModule && (
          <Panel
            title="Level berikutnya"
            link={{ href: `/peta#level-${nextModule.level}`, label: "Lihat di peta" }}
            className="col-span-2 lg:col-span-6"
          >
            <div className="flex items-start gap-3">
              <Lock className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-[17px] font-semibold text-ink">
                  Level {nextModule.level}: {nextModule.title}
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{nextModule.description}</p>
                <p className="tabular mt-3 text-[15px] text-ink">
                  {nextModule.duration_weeks} minggu, {nextModule.daily_minutes} menit sehari,{" "}
                  {nextModule.lessons.length} pelajaran
                </p>
                <p className="mt-3 text-[14px] text-muted-foreground">
                  Terbuka setelah {current.lessons.length - doneInLevel} pelajaran tersisa di Level {current.level}{" "}
                  selesai, termasuk kuisnya.
                </p>
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
