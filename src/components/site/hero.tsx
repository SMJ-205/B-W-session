"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { KeyBand } from "./key-band";
import { playNote } from "@/lib/audio/piano";
import { describePitch } from "@/lib/music/notation";
import { cn } from "@/lib/utils";

const PHOTOS = [
  {
    src: "/media/steinway-interior.jpg",
    alt: "Bagian dalam grand piano Steinway: dawai, rangka besi, dan felt",
    caption: "Begini isi sebuah grand piano",
  },
  {
    src: "/media/piano-hammers.jpg",
    alt: "Deretan hammer piano berlapis felt putih dari dekat",
    caption: "Hammer kecil inilah yang memukul dawai",
  },
  {
    src: "/media/piano-lesson-1873.jpg",
    alt: "Lukisan seorang anak perempuan bermain piano tegak sementara seorang perempuan duduk menyimak",
    caption: "Lezione di pianoforte, Vito D'Ancona, 1873",
  },
];

export function Hero() {
  const [pitch, setPitch] = useState("C4");
  const [photo, setPhoto] = useState(0);
  const name = describePitch(pitch);

  // Foto berganti perlahan; berhenti saat tab tersembunyi atau reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setPhoto((p) => (p + 1) % PHOTOS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const press = (p: string) => {
    setPitch(p);
    void playNote(p, "4n");
  };

  return (
    <section className="grid gap-4 p-3 sm:p-4 md:min-h-svh md:grid-cols-2">
      {/* Foto: di ponsel tampil lebih dulu */}
      <figure className="sticker relative order-first h-[26svh] overflow-hidden rounded-[24px] bg-ink md:sticky md:top-4 md:order-last md:h-[calc(100svh-32px)]">
        {PHOTOS.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(
              "drift object-cover saturate-[.8] sepia-[.25] transition-opacity duration-[1600ms]",
              i === photo ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <figcaption className="absolute top-3 left-3 md:top-auto md:bottom-5 md:left-5">
          <span className="inline-block rounded-full border-2 border-ink bg-surface px-3 py-1 text-[13px] font-bold text-ink">
            {PHOTOS[photo].caption}
          </span>
        </figcaption>
      </figure>

      <div className="sticker relative z-10 flex flex-col overflow-hidden rounded-[24px] text-ink md:min-h-[calc(100svh-32px)]">
        <KeyBand
          from="C4"
          to="B5"
          active={pitch}
          onPress={press}
          className="h-[84px] shrink-0 border-b-[2.5px] border-ink md:h-[132px]"
          whiteClass="bg-surface border-x border-ink"
          blackClass="bg-ink"
        />

        <p
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-hi px-4 py-1.5 text-[16px] font-bold md:mt-6"
          aria-live="polite"
        >
          <span className="text-[22px]">{name.solfege}</span>
          <span aria-hidden="true">·</span>
          <span>not angka {name.angka}</span>
          <span aria-hidden="true">·</span>
          <span>{name.letter}</span>
        </p>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-7 text-center md:px-6 md:py-10 lg:px-12">
          <h1 className="text-[clamp(2.1rem,4vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.03em]">
            <span className="whitespace-nowrap">Yuk, belajar</span>
            <br />
            <span className="whitespace-nowrap">main piano!</span>
          </h1>
          <p className="mt-6 max-w-[38ch] text-[length:var(--step-body)] leading-[1.55] md:mt-8">
            <span className="inline-flex items-baseline gap-1.5 font-bold">
              <BrandMark className="size-6 self-center" paper="var(--surface)" /> Notes of Nopia
            </span>{" "}
            mengajak kamu belajar piano sedikit demi sedikit, cukup 15 menit sehari. Tekan tuts di atas, dengarkan
            bunyinya, lalu lihat namanya.
          </p>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 md:mt-8")}>
            Ayo mulai!
          </Link>
        </div>

        <nav aria-label="Halaman" className="flex flex-wrap justify-center gap-x-6 gap-y-2 pb-7 text-[15px] font-bold">
          <a href="#kurikulum" className="underline-offset-4 hover:underline">
            Kurikulum
          </a>
          <a href="#cara" className="underline-offset-4 hover:underline">
            Cara latihan
          </a>
          <Link href="/login" className="underline-offset-4 hover:underline">
            Masuk
          </Link>
        </nav>
      </div>
    </section>
  );
}
