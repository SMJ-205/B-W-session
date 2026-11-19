"use client";

import { useMemo } from "react";
import { midiToPitch, toMidi } from "@/lib/music/notation";
import { cn } from "@/lib/utils";

/**
 * Pita tuts datar: tuts putih berwarna kertas, tuts hitam berwarna tinta.
 * Dipakai di hero (bisa dimainkan) dan sebagai motif dekor (tanpa interaksi).
 */
export function KeyBand({
  from = "C4",
  to = "B5",
  active,
  onPress,
  className,
  whiteClass = "bg-paper",
  blackClass = "bg-oxblood",
  interactive = true,
}: {
  from?: string;
  to?: string;
  active?: string | null;
  onPress?: (pitch: string) => void;
  className?: string;
  whiteClass?: string;
  blackClass?: string;
  interactive?: boolean;
}) {
  const keys = useMemo(() => {
    const out: { pitch: string; black: boolean }[] = [];
    for (let m = toMidi(from); m <= toMidi(to); m++) {
      const pitch = midiToPitch(m);
      out.push({ pitch, black: pitch.includes("#") });
    }
    return out;
  }, [from, to]);
  const whites = keys.filter((k) => !k.black).length;
  const activeMidi = active ? toMidi(active) : null;

  let wi = 0;
  return (
    <div
      className={cn("relative select-none", className)}
      role={interactive ? "group" : "img"}
      aria-label={interactive ? "Keyboard: tekan tuts untuk mendengar nadanya" : "Deret tuts piano"}
    >
      {keys.map((k) => {
        const isActive = activeMidi !== null && toMidi(k.pitch) === activeMidi;
        const common = {
          "aria-label": interactive ? k.pitch : undefined,
          "aria-hidden": interactive ? undefined : true,
          tabIndex: interactive ? 0 : -1,
          onPointerDown: interactive ? () => onPress?.(k.pitch) : undefined,
          onKeyDown: interactive
            ? (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPress?.(k.pitch);
                }
              }
            : undefined,
        };
        if (!k.black) {
          const left = (wi++ / whites) * 100;
          const El = interactive ? "button" : "span";
          return (
            <El
              key={k.pitch}
              {...common}
              type={interactive ? "button" : undefined}
              style={{ left: `${left}%`, width: `calc(${100 / whites}% - 4px)` }}
              className={cn(
                "key-shape absolute top-0 h-full transition-colors duration-100",
                isActive ? "bg-lit" : whiteClass,
                interactive && "cursor-pointer touch-manipulation hover:brightness-95",
              )}
            />
          );
        }
        const left = (wi / whites) * 100 - (100 / whites) * 0.3;
        const El = interactive ? "button" : "span";
        return (
          <El
            key={k.pitch}
            {...common}
            type={interactive ? "button" : undefined}
            style={{ left: `${left}%`, width: `${(100 / whites) * 0.56}%` }}
            className={cn(
              "key-shape absolute top-0 z-10 h-[62%] transition-colors duration-100",
              isActive ? "bg-lit" : blackClass,
              interactive && "cursor-pointer touch-manipulation",
            )}
          />
        );
      })}
    </div>
  );
}
