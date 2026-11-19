import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { KeyBandArt } from "./key-band-art";
import { cn } from "@/lib/utils";

/**
 * Penutup: deret tuts raksasa di satu kolom, ajakan di kolom lain.
 * Keduanya kolom grid terpisah, jadi gambar tuts tidak pernah berada di
 * belakang teks di lebar layar mana pun.
 */
export function Closing() {
  return (
    <section className="mx-3 mt-[clamp(88px,14vw,220px)] grid overflow-hidden rounded-[24px] border-[2.5px] border-ink bg-surface shadow-[4px_4px_0_var(--ink)] sm:mx-4 md:mx-12 md:min-h-[72svh] md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="order-1 flex flex-col justify-center px-5 py-10 sm:px-8 md:order-2 md:border-l-[2.5px] md:border-ink md:px-10 md:py-14 lg:px-14">
        <h2
          data-reveal
          className="text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.03em] text-oxblood"
        >
          Siap tekan tuts pertama?
        </h2>
        <p
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 max-w-[42ch] text-[17px] leading-[1.55] text-ink"
        >
          Tidak perlu daftar. Progress kamu langsung tersimpan di browser ini. Kalau mau menyimpannya ke akun, minta
          bantuan orang tua untuk masuk.
        </p>
        <p
          data-reveal
          style={{ "--i": 2 } as React.CSSProperties}
          className="mt-5 text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] leading-snug font-bold text-oxblood"
        >
          Level 1: 2 minggu, 15 menit sehari
        </p>
        <Link
          href="/dashboard"
          data-reveal
          style={{ "--i": 3 } as React.CSSProperties}
          className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 w-full self-start sm:w-auto")}
        >
          Mulai Level 1
        </Link>
      </div>

      {/* Gambar tuts: kolomnya sendiri, dipotong rapi oleh overflow */}
      <div className="relative order-2 h-[34svh] overflow-hidden border-t-[2.5px] border-ink md:order-1 md:h-auto md:border-t-0">
        <KeyBandArt
          className="absolute inset-y-0 left-[-4%] h-[118%] w-[108%]"
          white="var(--surface)"
          black="var(--oxblood)"
        />
      </div>
    </section>
  );
}
