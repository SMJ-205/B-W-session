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
  /** Tidak dipakai lagi; semua kartu putih. */
  white?: boolean;
}) {
  return (
    <section data-reveal className={cn("sticker p-5", className)}>
      <header className="mb-4 flex items-center gap-2">
        <h2 className="text-[17px] font-bold text-ink">{title}</h2>
        {chip && (
          <span className="tabular rounded-full border-2 border-ink bg-hi px-2.5 py-0.5 text-[12px] font-bold text-ink">
            {chip}
          </span>
        )}
        {link && (
          <Link
            href={link.href}
            className="press ml-auto rounded-full border-2 border-ink bg-white px-3 py-1 text-[13px] font-bold text-ink shadow-[2px_2px_0_var(--ink)]"
          >
            {link.label}
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export function Tile({ label, value, caption }: { label: string; value: ReactNode; caption: ReactNode }) {
  return (
    <div data-reveal className="sticker flex min-h-[128px] flex-col p-4">
      <p className="text-[13px] font-bold text-muted-foreground">{label}</p>
      <p className="tabular mt-1 text-[30px] leading-tight font-bold text-ink">{value}</p>
      <p className="mt-auto pt-2 text-[13px] leading-snug text-muted-foreground">{caption}</p>
    </div>
  );
}
