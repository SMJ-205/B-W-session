import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WORD = "NOTESOFNOPIA".split("");
/** Tinggi tiap blok huruf (persen dari pita), seperti tuts dengan panjang berbeda. */
const HEIGHTS = [100, 72, 88, 64, 94, 78, 100, 68, 90, 74, 96, 82];

const CREDITS: { title: string; href: string; by?: string; license: string; licenseHref: string; source: string }[] = [
  { title: "Steinway grand piano interior", href: "https://commons.wikimedia.org/wiki/File:Steinway_grand_piano_interior.JPG", by: "Kjethdubns", license: "CC0", licenseHref: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "Wikimedia Commons" },
  { title: "Grand piano action - Piano Hammers", href: "https://commons.wikimedia.org/wiki/File:Grand_piano_action_-_Piano_Hammers,_at_piano_shop_Steinway_Pianos_of_Calgary.jpg", by: "Rhona-Mae Arca", license: "CC BY 2.0", licenseHref: "https://creativecommons.org/licenses/by/2.0", source: "Wikimedia Commons" },
  { title: "The Pianolesson", href: "https://commons.wikimedia.org/wiki/File:De_Pianoles_door_Henri%C3%ABtte_Ronner-Knip.jpg", by: "Henriëtte Ronner-Knip", license: "domain publik", licenseHref: "https://creativecommons.org/publicdomain/mark/1.0/", source: "Wikimedia Commons" },
  { title: "Lezione di pianoforte", href: "https://commons.wikimedia.org/wiki/File:Piano_Lesson_(1873),_by_Vito_D%E2%80%99Ancona.jpg", by: "Vito D'Ancona", license: "domain publik", licenseHref: "https://creativecommons.org/publicdomain/mark/1.0/", source: "Wikimedia Commons" },
  { title: "Metronome (pendulum swinging)", href: "https://commons.wikimedia.org/w/index.php?curid=2055136", by: "AndonicO", license: "CC BY 2.5", licenseHref: "https://creativecommons.org/licenses/by/2.5/", source: "Wikimedia Commons" },
  { title: "Square piano made by Andrew Rochead in Edinburgh", href: "https://commons.wikimedia.org/wiki/File:Square_piano_made_by_Andrew_Rochead_in_Edinburgh.webm", by: "St Cecilia's Hall (dipotong, tanpa suara)", license: "CC BY 3.0", licenseHref: "https://creativecommons.org/licenses/by/3.0", source: "Wikimedia Commons" },
];

const LINKS = [
  { title: "Belajar", items: [["Beranda", "/dashboard"], ["Latihan harian", "/latihan"], ["Peta level", "/peta"]] },
  { title: "Halaman ini", items: [["Kurikulum", "#kurikulum"], ["Cara latihan", "#cara"]] },
  { title: "Akun", items: [["Masuk", "/login"]] },
  { title: "Teknologi", items: [["VexFlow", "https://www.vexflow.com"], ["Tone.js", "https://tonejs.github.io"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-oxblood px-4 pt-16 pb-10 text-paper md:px-12">
      {/* Wordmark dibangun dari blok seperti deret tuts */}
      {/* Ponsel: dua baris (NOTES OF / NOPIA) agar hurufnya tetap besar */}
      <div className="space-y-1 md:hidden" role="img" aria-label="Notes of Nopia">
        {[WORD.slice(0, 7), WORD.slice(7)].map((row, r) => (
          <div key={r} className="flex h-[14svh] items-end gap-1">
            {row.map((ch, i) => (
              <div
                key={i}
                style={{ height: `${HEIGHTS[r * 7 + i]}%` }}
                className={cn(
                  "key-shape flex flex-1 items-end justify-center bg-paper pb-2 text-[clamp(1.5rem,8vw,2.5rem)] leading-none font-bold text-oxblood",
                  r === 0 && i === 5 && "ml-2",
                )}
              >
                {ch}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden h-[34svh] items-end gap-1 md:flex" role="img" aria-label="Notes of Nopia">
        {WORD.map((ch, i) => (
          <div
            key={i}
            style={{ height: `${HEIGHTS[i]}%` }}
            className={cn(
              "key-shape flex flex-1 items-end justify-center bg-paper pb-[1.5vw] text-[clamp(1.25rem,5.2vw,5.5rem)] leading-none font-bold text-oxblood",
              (i === 5 || i === 7) && "ml-[1.5vw]",
            )}
          >
            {ch}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:mt-14 md:grid-cols-12">
        <nav aria-label="Tautan footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-4">
          {LINKS.map((col) => (
            <div key={col.title}>
              <h2 className="text-[16px] font-bold">{col.title}</h2>
              <ul className="mt-3 space-y-2 text-[16px]">
                {col.items.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="underline-offset-4 hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="md:col-span-5">
          <h2 className="text-[16px] font-bold">Gambar dan video</h2>
          <p className="mt-3 text-[13px] leading-relaxed">
            {CREDITS.map((c, i) => (
              <span key={c.href}>
                <a href={c.href} className="underline underline-offset-2">
                  “{c.title}”
                </a>
                {c.by && ` oleh ${c.by}`},{" "}
                <a href={c.licenseHref} className="underline underline-offset-2">
                  {c.license}
                </a>
                , lewat {c.source}
                {i < CREDITS.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 text-[13px]">
        <p>© 2026 Notes of Nopia</p>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-paper text-oxblood")}>
          Mulai latihan
        </Link>
      </div>
    </footer>
  );
}
