import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Kartu stiker dengan judul, chip angka, dan tautan opsional. */
export function Panel({
  title,
  chip,
  link,
  className,
  children,
}: {
  title: string;
  chip?: ReactNode;
  link?: { href: string; label: string };
  className?: string;
  children: ReactNode;
  /** Tidak dipakai lagi. */
  white?: boolean;
}) {
  return (
    <section data-reveal className={cn("sticker p-5", className)}>
      <header className="mb-4 flex items-center gap-2">
        <h2 className="min-w-0 text-[17px] font-bold text-ink">{title}</h2>
        {chip && (
          <span
            className={cn(
              "tabular shrink-0 rounded-full border-2 border-ink bg-hi px-2.5 py-0.5 text-[12px] font-bold whitespace-nowrap text-ink",
              // Di ponsel, chip disembunyikan kalau ada tautan, agar judul tidak terdesak jadi dua baris.
              link && "max-sm:hidden",
            )}
          >
            {chip}
          </span>
        )}
        {link && (
          <Link
            href={link.href}
            className="press ml-auto shrink-0 rounded-full border-2 border-ink bg-surface px-3 py-1 text-[13px] font-bold whitespace-nowrap text-ink shadow-[2px_2px_0_var(--ink)]"
          >
            {link.label}
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export function Tile({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: ReactNode;
  caption: ReactNode;
  /** Ikon kecil berwarna kuningan di samping label (mis. streak). */
  icon?: ReactNode;
}) {
  return (
    <div data-reveal className="sticker flex min-h-[128px] flex-col p-4">
      <p className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="tabular mt-1 text-[30px] leading-tight font-bold text-ink">{value}</p>
      <p className="mt-auto pt-2 text-[13px] leading-snug text-muted-foreground">{caption}</p>
    </div>
  );
}
