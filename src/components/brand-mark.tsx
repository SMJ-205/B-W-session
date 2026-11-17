import { cn } from "@/lib/utils";

/** Tanda merek: tiga tuts (putih, hitam, putih) dalam warna oxblood. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="1" y="2" width="10" height="20" rx="1" fill="currentColor" opacity="0.28" />
      <rect x="13" y="2" width="10" height="20" rx="1" fill="currentColor" opacity="0.28" />
      <path d="M8 2h8v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" fill="currentColor" />
    </svg>
  );
}
