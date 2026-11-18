import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { KeyBandArt } from "./key-band-art";
import { cn } from "@/lib/utils";

/** Motif kembali sekali lagi: deret tuts raksasa yang terpotong tepi bagian. */
export function Closing() {
  return (
    <section className="relative mx-3 mt-[clamp(88px,14vw,220px)] flex min-h-[80svh] flex-col overflow-hidden rounded-[24px] border-[2.5px] border-ink bg-surface shadow-[4px_4px_0_var(--ink)] sm:mx-4 md:mx-12 md:block">
      <div className="relative z-10 order-1 px-4 pt-14 md:absolute md:top-1/2 md:right-12 md:w-[min(30vw,420px)] md:-translate-y-1/2 md:px-0 md:pt-0">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.03em] text-oxblood"
        >
          Siap tekan tuts pertama?
        </h2>
        <p
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 text-[17px] leading-[1.55] text-oxblood"
        >
          Tidak perlu daftar. Progress kamu langsung tersimpan di browser ini. Kalau mau menyimpannya ke akun, minta
          bantuan orang tua untuk masuk.
        </p>
        <p
          data-reveal
          style={{ "--i": 2 } as React.CSSProperties}
          className="mt-5 text-[26px] font-bold text-oxblood"
        >
          Level 1: 2 minggu, 15 menit sehari
        </p>
        <Link
          href="/dashboard"
          data-reveal
          style={{ "--i": 3 } as React.CSSProperties}
          className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 w-full md:w-auto")}
        >
          Mulai Level 1
        </Link>
      </div>

      <div className="relative order-2 mt-10 h-[34svh] md:absolute md:top-0 md:bottom-[-18%] md:left-[-6%] md:mt-0 md:h-auto md:w-[72%]">
        <KeyBandArt className="h-full w-[130%] md:w-full" white="var(--surface)" black="var(--oxblood)" />
      </div>
    </section>
  );
}
