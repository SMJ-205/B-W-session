import Link from "next/link";
import type { ModuleWithLessons } from "@/lib/curriculum/types";
import { cn } from "@/lib/utils";

interface WeekTimelineProps {
  curriculum: ModuleWithLessons[];
  starts: Map<string, number>;
  /** Minggu global posisi aktual. */
  actualWeek: number;
  /** Minggu global menurut kalender. */
  planWeek: number;
}

/**
 * Elemen khas produk: 45 minggu digambar sebagai deret tuts, dikelompokkan
 * per level. Tuts terisi = minggu yang sudah lewat; oxblood = minggu ini;
 * garis kecil di atas tuts = posisi menurut kalender.
 */
export function WeekTimeline({ curriculum, starts, actualWeek, planWeek }: WeekTimelineProps) {
  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {curriculum.map((m) => {
          const start = starts.get(m.id) ?? 1;
          return (
            <Link
              key={m.id}
              href={`/peta#level-${m.level}`}
              className="group flex min-w-0 flex-col gap-1.5"
              style={{ flex: `${m.duration_weeks} 0 ${m.duration_weeks * 14}px` }}
              aria-label={`Level ${m.level}: ${m.title}, minggu ${start} sampai ${start + m.duration_weeks - 1}`}
            >
              <div className="flex h-[72px] gap-[3px]">
                {Array.from({ length: m.duration_weeks }, (_, i) => {
                  const w = start + i;
                  return (
                    <div key={w} className="relative flex-1">
                      {w === planWeek && w !== actualWeek && (
                        <span className="absolute -top-2 left-1/2 h-1.5 w-px -translate-x-1/2 bg-oxblood" />
                      )}
                      <div
                        title={`Minggu ${w}`}
                        className={cn(
                          "key-shape h-full border-2 border-ink transition-colors",
                          w < actualWeek && "bg-ink",
                          w === actualWeek && "bg-lit",
                          w > actualWeek && "bg-white group-hover:bg-hi",
                        )}
                      />
                    </div>
                  );
                })}
              </div>
              <span
                className={cn(
                  "tabular text-[12px] leading-none",
                  actualWeek >= start && actualWeek < start + m.duration_weeks
                    ? "font-semibold text-ink"
                    : "text-muted-foreground",
                )}
              >
                {m.level}
              </span>
            </Link>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="key-shape inline-block h-3 w-2 border border-ink bg-ink" /> Sudah lewat
        </li>
        <li className="flex items-center gap-1.5">
          <span className="key-shape inline-block h-3 w-2 border border-ink bg-lit" /> Minggu ini
        </li>
        {planWeek !== actualWeek && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-px bg-oxblood" /> Jadwal: minggu {planWeek}
          </li>
        )}
        <li>Angka di bawah = nomor level</li>
      </ul>
    </div>
  );
}
