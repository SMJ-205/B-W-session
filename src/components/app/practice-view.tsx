"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotationPlayer } from "@/components/music/notation-player";
import { MobileActionBar } from "./app-shell";
import { WeekStrip } from "./week-strip";
import { useLearner } from "./use-learner";
import { logPractice } from "@/lib/curriculum/repository";

export function PracticeView() {
  const { state, derived: d, reload } = useLearner();
  const [bpm, setBpm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state || !d) {
    return <div className="mx-auto max-w-[1100px] px-6 py-16 text-muted-foreground">Memuat latihan…</div>;
  }

  const { current } = d;
  const playedBpm = bpm ?? d.bpmToday;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await logPractice({ date: state.today, module_id: current.id, bpm: playedBpm });
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-28 sm:px-6 md:pt-[72px] md:pb-20">
      <header data-reveal className="max-w-[820px]">
        <p className="text-[15px] text-muted-foreground">
          <Link href="/dashboard" className="hover:text-ink hover:underline">
            Beranda
          </Link>{" "}
          / Latihan harian
        </p>
        <h1 className="mt-2 text-[24px] leading-tight font-semibold text-ink md:text-[30px]">{current.drill.title}</h1>
        <p className="mt-2 text-[17px] leading-relaxed text-ink">
          {d.todayEntry ? (
            <>Latihan hari ini sudah tercatat di {d.todayEntry.bpm} BPM. Ulangi kapan saja; catatan terakhir yang disimpan.</>
          ) : (
            <>
              Mainkan sampai tidak ada not yang tersendat di {d.bpmToday} BPM, lalu catat. Tempo naik sedikit di
              setiap sesi sampai {current.drill.bpm_goal} BPM.
            </>
          )}
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:mt-10 lg:grid-cols-12">
        <section data-reveal className="-mx-4 min-w-0 border-y border-border bg-white px-4 py-5 sm:mx-0 sm:rounded-xl sm:border sm:p-5 lg:col-span-9">
          <h2 className="sr-only">Partitur latihan</h2>
          <NotationPlayer
            key={`${current.id}-${d.bpmToday}`}
            notation={current.drill.notation}
            clef={current.drill.clef}
            initialBpm={d.bpmToday}
            onFinished={setBpm}
          />
        </section>

        <aside className="flex flex-col gap-4 lg:col-span-3">
          <section data-reveal className="hidden rounded-xl bg-panel p-5 md:block">
            <h2 className="mb-4 text-[14px] font-semibold text-ink">Catat latihan</h2>
            <p className="tabular text-[28px] leading-tight text-ink">{playedBpm} BPM</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {bpm ? "Tempo putaran terakhir" : "Tempo yang disarankan hari ini"}
            </p>
            <Button onClick={save} disabled={saving} size="lg" className="mt-5 w-full">
              {d.todayEntry ? <Check /> : null}
              {saving ? "Menyimpan…" : d.todayEntry ? "Perbarui catatan" : "Selesai latihan hari ini"}
            </Button>
            {error && <p className="mt-2 text-[13px] text-destructive">{error}</p>}
          </section>

          <section data-reveal className="rounded-xl bg-panel p-5">
            <h2 className="mb-4 text-[14px] font-semibold text-ink">Pekan ini</h2>
            <WeekStrip practice={state.practice} today={state.today} />
          </section>

          <section data-reveal className="rounded-xl bg-panel p-5">
            <h2 className="mb-3 text-[14px] font-semibold text-ink">Target minggu ini</h2>
            <p className="font-serif text-[16px] leading-[1.5] text-ink">{current.weekly_targets[d.week - 1]}</p>
          </section>
        </aside>
      </div>

      {/* Ponsel: aksi utama selalu dalam jangkauan ibu jari */}
      <MobileActionBar>
        <div className="min-w-0 flex-1">
          <p className="tabular text-[20px] leading-tight text-ink">{playedBpm} BPM</p>
          <p className="truncate text-[13px] text-muted-foreground">
            {error ?? (bpm ? "Tempo putaran terakhir" : "Tempo hari ini")}
          </p>
        </div>
        <Button onClick={save} disabled={saving} size="lg" className="shrink-0">
          {d.todayEntry ? <Check /> : null}
          {saving ? "Menyimpan…" : d.todayEntry ? "Perbarui" : "Selesai latihan"}
        </Button>
      </MobileActionBar>
    </div>
  );
}
