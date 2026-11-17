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
    alt: "Bagian dalam grand piano Steinway: dawai, rangka besi, dan felt merah",
    caption: "Bagian dalam grand piano Steinway model B-211",
  },
  {
    src: "/media/piano-hammers.jpg",
    alt: "Deretan hammer piano berlapis felt putih dari dekat",
    caption: "Deretan hammer berlapis felt di dalam grand piano",
  },
  {
    src: "/media/piano-lesson-1873.jpg",
    alt: "Lukisan seorang gadis bermain piano tegak sementara seorang perempuan duduk menyimak",
    caption: "Lezione di pianoforte, Vito D'Ancona, 1873",
  },
];

export function Hero() {
  const [pitch, setPitch] = useState("C4");
  const [photo, setPhoto] = useState(0);
  const name = describePitch(pitch);

  // Gerak khas: foto berganti perlahan, berhenti saat tab tersembunyi atau reduced motion.
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
    <section className="grid gap-3 p-3 md:min-h-svh md:grid-cols-2">
      {/* Foto: di ponsel tampil lebih dulu */}
      <figure className="relative order-first h-[26svh] overflow-hidden rounded-[4px_4px_32px_32px] bg-ink md:sticky md:top-3 md:order-last md:h-[calc(100svh-24px)]">
        {PHOTOS.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(
              "drift object-cover grayscale-[0.7] transition-opacity duration-[1600ms]",
              i === photo ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <figcaption className="absolute top-4 right-4 left-4 text-[13px] text-paper md:top-auto md:right-5 md:bottom-6 md:left-5">
          <span className="bg-ink/70 px-2 py-1">{PHOTOS[photo].caption}</span>
        </figcaption>
      </figure>

      <div className="relative z-10 -mt-9 flex flex-col overflow-hidden rounded-[4px_4px_32px_32px] bg-paper-2 text-oxblood md:mt-0 md:min-h-[calc(100svh-24px)]">
        <KeyBand
          from="C4"
          to="B5"
          active={pitch}
          onPress={press}
          className="h-[72px] shrink-0 md:h-[132px]"
          whiteClass="bg-paper"
          blackClass="bg-oxblood"
        />

        <p className="mt-4 text-center text-[17px] text-oxblood-soft md:mt-5" aria-live="polite">
          <span className="text-[26px] font-bold text-oxblood">{name.solfege}</span>
          <span className="mx-2">·</span>not angka <span className="font-bold text-oxblood">{name.angka}</span>
          <span className="mx-2">·</span>
          {name.letter}
        </p>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-7 text-center md:px-6 md:py-10 lg:px-12">
          <h1 className="text-[clamp(2rem,3.7vw,4.25rem)] leading-[0.92] font-bold tracking-[-0.035em] uppercase">
            <span className="whitespace-nowrap">Main piano,</span>
            <br />
            <span className="whitespace-nowrap">baca not balok</span>
          </h1>
          <p className="mt-6 max-w-[38ch] font-serif text-[length:var(--step-body)] leading-[1.55] text-oxblood md:mt-8">
            <span className="inline-flex items-baseline gap-1.5 font-sans font-bold">
              <BrandMark className="size-6 self-center" /> Notes of Nopia
            </span>{" "}
            menyusun 12 level selama 45 minggu, 15 sampai 30 menit sehari. Partitur, suara piano, dan keyboard
            semuanya ada di browser.
          </p>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 md:mt-8")}>
            Mulai latihan hari ini
          </Link>
        </div>

        <nav aria-label="Halaman" className="flex flex-wrap justify-center gap-x-8 gap-y-2 pb-7 text-[16px]">
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
