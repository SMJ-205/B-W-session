import { weekDates } from "@/lib/curriculum/schedule";
import type { PracticeEntry } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

/** Tujuh hari pekan ini: tuts terisi = sudah latihan. */
export function WeekStrip({ practice, today }: { practice: PracticeEntry[]; today: string }) {
  const done = new Map(practice.map((p) => [p.date, p.bpm]));
  const dates = weekDates(today);
  const count = dates.filter((d) => done.has(d)).length;

  return (
    <div>
      <ol className="grid grid-cols-7 gap-1" aria-label={`Pekan ini: ${count} dari 7 hari latihan`}>
        {dates.map((d, i) => {
          const bpm = done.get(d);
          const isToday = d === today;
          return (
            <li key={d} className="flex flex-col items-center gap-1.5">
              <div
                title={bpm ? `${d}: ${bpm} BPM` : d}
                className={cn(
                  "h-10 w-full rounded-[10px] border-2 border-ink",
                  bpm ? "bg-oxblood" : d > today ? "bg-surface" : "bg-hi",
                  isToday && !bpm && "border-dashed bg-surface",
                )}
              />
              <span className={cn("text-[12px]", isToday ? "font-bold text-ink" : "text-muted-foreground")}>
                {DAYS[i]}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Pekan ini kamu latihan <span className="tabular">{count}</span> dari 7 hari
      </p>
    </div>
  );
}
