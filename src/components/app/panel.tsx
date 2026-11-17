import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Panel tonal satu lapis: judul 14/600, isi langsung di atas panel. */
export function Panel({
  title,
  chip,
  link,
  className,
  children,
  white = false,
}: {
  title: string;
  chip?: ReactNode;
  link?: { href: string; label: string };
  className?: string;
  children: ReactNode;
  /** Kartu putih: dipakai sekali saja, untuk elemen utama. */
  white?: boolean;
}) {
  return (
    <section
      data-reveal
      className={cn("rounded-xl p-5", white ? "border border-border bg-white" : "bg-panel", className)}
    >
      <header className="mb-4 flex items-center gap-2">
        <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
        {chip && (
          <span className="tabular rounded-full bg-[#e6e3e3] px-2 py-0.5 text-[12px] text-muted-foreground">
            {chip}
          </span>
        )}
        {link && (
          <Link href={link.href} className="ml-auto text-[13px] text-muted-foreground hover:text-ink hover:underline">
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
    <div data-reveal className="flex min-h-[128px] flex-col rounded-xl bg-panel p-4">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="tabular mt-1 text-[28px] leading-tight font-normal text-ink">{value}</p>
      <p className="mt-auto pt-2 text-[13px] leading-snug text-muted-foreground">{caption}</p>
    </div>
  );
}
