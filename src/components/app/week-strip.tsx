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
                  "key-shape h-10 w-full",
                  bpm ? "bg-ink" : d > today ? "bg-white" : "bg-[#dcd8d8]",
                  isToday && !bpm && "outline-2 -outline-offset-2 outline-oxblood",
                )}
              />
              <span className={cn("text-[12px]", isToday ? "font-semibold text-ink" : "text-muted-foreground")}>
                {DAYS[i]}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[13px] text-muted-foreground">
        <span className="tabular">{count}</span> dari 7 hari pekan ini
      </p>
    </div>
  );
}
